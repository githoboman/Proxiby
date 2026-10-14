;; skela-messaging
;; On-chain pointers for E2E-encrypted DMs and group messages, plus the public
;; GM Board. Message *content* lives off-chain in Gaia; only a pointer + content
;; hash are stored on-chain. GM Board posts store their (short) text directly.
;;
;; - send-message:        DM pointer; recipient must be registered.
;; - send-group-message:  group pointer; sender must be a group member.
;; - post-gm:             public 140-char post, anchored to block height.

;; ---------------------------------------------------------------------------
;; Constants / errors
;; ---------------------------------------------------------------------------

(define-constant ERR-RECIPIENT-NOT-REGISTERED (err u300))
(define-constant ERR-NOT-GROUP-MEMBER         (err u301))
(define-constant ERR-EMPTY-GM                 (err u302))
(define-constant ERR-MESSAGE-NOT-FOUND        (err u303))
(define-constant ERR-GM-NOT-FOUND             (err u304))

;; ---------------------------------------------------------------------------
;; Data
;; ---------------------------------------------------------------------------

(define-data-var message-counter uint u0)
(define-data-var gm-counter uint u0)

(define-map message-pointers
  uint
  { sender: principal,
    recipient: principal,
    gaia-pointer: (string-utf8 256),
    content-hash: (buff 32),
    timestamp: uint,
    is-group: bool,
    group-id: (optional uint) })

(define-map gm-posts
  uint
  { author: principal,
    message: (string-utf8 140),
    block-height: uint })

;; ---------------------------------------------------------------------------
;; Read-only
;; ---------------------------------------------------------------------------

(define-read-only (get-message (id uint))
  (map-get? message-pointers id))

(define-read-only (get-gm (id uint))
  (map-get? gm-posts id))

(define-read-only (get-message-count)
  (var-get message-counter))

(define-read-only (get-gm-count)
  (var-get gm-counter))

;; ---------------------------------------------------------------------------
;; Public
;; ---------------------------------------------------------------------------

(define-public (send-message
    (recipient principal)
    (gaia-pointer (string-utf8 256))
    (content-hash (buff 32)))
  (let ((new-id (+ (var-get message-counter) u1)))
    ;; recipient must be a registered SKELA user
    (asserts!
      (contract-call? .skela-registry is-registered recipient)
      ERR-RECIPIENT-NOT-REGISTERED)

    ;; #[allow(unchecked_data)] gaia-pointer/content-hash are opaque off-chain refs
    (map-set message-pointers new-id
      { sender: tx-sender,
        recipient: recipient,
        gaia-pointer: gaia-pointer,
        content-hash: content-hash,
        timestamp: stacks-block-height,
        is-group: false,
        group-id: none })
    (var-set message-counter new-id)

    (print { event: "send-message", id: new-id, sender: tx-sender, recipient: recipient })
    (ok new-id)))

(define-public (send-group-message
    (group-id uint)
    (gaia-pointer (string-utf8 256))
    (content-hash (buff 32)))
  (let ((new-id (+ (var-get message-counter) u1)))
    ;; sender must be a member of the group
    (asserts!
      (contract-call? .skela-groups is-member group-id tx-sender)
      ERR-NOT-GROUP-MEMBER)

    ;; #[allow(unchecked_data)] gaia-pointer/content-hash are opaque off-chain refs
    (map-set message-pointers new-id
      { sender: tx-sender,
        recipient: tx-sender,        ;; not meaningful for groups; recipient = group
        gaia-pointer: gaia-pointer,
        content-hash: content-hash,
        timestamp: stacks-block-height,
        is-group: true,
        group-id: (some group-id) })
    (var-set message-counter new-id)

    (print { event: "send-group-message", id: new-id, sender: tx-sender, group-id: group-id })
    (ok new-id)))

(define-public (post-gm (message (string-utf8 140)))
  (let ((new-id (+ (var-get gm-counter) u1)))
    (asserts! (> (len message) u0) ERR-EMPTY-GM)

    (map-set gm-posts new-id
      { author: tx-sender,
        message: message,
        block-height: stacks-block-height })
    (var-set gm-counter new-id)

    (print { event: "post-gm", id: new-id, author: tx-sender })
    (ok new-id)))
