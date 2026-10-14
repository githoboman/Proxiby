;; skela-groups
;; Group creation and membership management for SKELA.
;;
;; Max 10 members per group (Clarity list bound). Only the creator can add or
;; remove members; any member may leave. A principal indexes up to 20 groups.
;; Membership is consulted by skela-messaging to gate group messages.

;; ---------------------------------------------------------------------------
;; Constants / errors
;; ---------------------------------------------------------------------------

(define-constant MAX-MEMBERS u10)

(define-constant ERR-GROUP-NOT-FOUND   (err u200))
(define-constant ERR-NOT-CREATOR       (err u201))
(define-constant ERR-GROUP-FULL        (err u202))
(define-constant ERR-ALREADY-MEMBER    (err u203))
(define-constant ERR-NOT-MEMBER        (err u204))
(define-constant ERR-EMPTY-NAME        (err u205))
(define-constant ERR-USER-GROUPS-FULL  (err u206))
(define-constant ERR-CREATOR-LEAVE     (err u207))

;; ---------------------------------------------------------------------------
;; Data
;; ---------------------------------------------------------------------------

(define-data-var group-counter uint u0)

(define-map groups
  uint
  { name: (string-utf8 64), creator: principal, created-at: uint })

;; group-id -> member list
(define-map group-members uint (list 10 principal))

;; principal -> group ids they belong to
(define-map member-groups principal (list 20 uint))

;; ---------------------------------------------------------------------------
;; Read-only
;; ---------------------------------------------------------------------------

(define-read-only (get-group (id uint))
  (map-get? groups id))

(define-read-only (get-members (id uint))
  (default-to (list) (map-get? group-members id)))

(define-read-only (is-member (group-id uint) (addr principal))
  (is-some (index-of (get-members group-id) addr)))

(define-read-only (get-user-groups (addr principal))
  (default-to (list) (map-get? member-groups addr)))

(define-read-only (get-group-count)
  (var-get group-counter))

;; ---------------------------------------------------------------------------
;; Private helpers
;; ---------------------------------------------------------------------------

;; Append a group id to a principal's group index.
(define-private (add-group-to-member (addr principal) (group-id uint))
  (let ((current (get-user-groups addr)))
    (match (as-max-len? (append current group-id) u20)
      updated (begin (map-set member-groups addr updated) (ok true))
      ERR-USER-GROUPS-FULL)))

;; ---------------------------------------------------------------------------
;; Public
;; ---------------------------------------------------------------------------

(define-public (create-group (name (string-utf8 64)))
  (let ((new-id (+ (var-get group-counter) u1)))
    (asserts! (> (len name) u0) ERR-EMPTY-NAME)

    (map-set groups new-id
      { name: name, creator: tx-sender, created-at: stacks-block-height })
    (map-set group-members new-id (list tx-sender))
    (try! (add-group-to-member tx-sender new-id))
    (var-set group-counter new-id)

    (print { event: "create-group", group-id: new-id, creator: tx-sender, name: name })
    (ok new-id)))

(define-public (add-member (group-id uint) (member principal))
  (let ((group (unwrap! (map-get? groups group-id) ERR-GROUP-NOT-FOUND))
        (members (get-members group-id)))
    (asserts! (is-eq tx-sender (get creator group)) ERR-NOT-CREATOR)
    (asserts! (is-none (index-of members member)) ERR-ALREADY-MEMBER)

    (let ((updated (unwrap! (as-max-len? (append members member) u10) ERR-GROUP-FULL)))
      (map-set group-members group-id updated)
      (try! (add-group-to-member member group-id))
      (print { event: "add-member", group-id: group-id, member: member })
      (ok true))))

(define-public (remove-member (group-id uint) (member principal))
  (let ((group (unwrap! (map-get? groups group-id) ERR-GROUP-NOT-FOUND))
        (members (get-members group-id)))
    (asserts! (is-eq tx-sender (get creator group)) ERR-NOT-CREATOR)
    (asserts! (is-some (index-of members member)) ERR-NOT-MEMBER)
    ;; creator cannot be removed (use a transfer-ownership flow instead, out of scope)
    (asserts! (not (is-eq member (get creator group))) ERR-CREATOR-LEAVE)

    (map-set group-members group-id (filter-out members member))
    (map-set member-groups member (filter-out-uint (get-user-groups member) group-id))
    (print { event: "remove-member", group-id: group-id, member: member })
    (ok true)))

(define-public (leave-group (group-id uint))
  (let ((group (unwrap! (map-get? groups group-id) ERR-GROUP-NOT-FOUND))
        (members (get-members group-id)))
    (asserts! (is-some (index-of members tx-sender)) ERR-NOT-MEMBER)
    ;; creator cannot leave their own group (must remove themselves via ownership flow)
    (asserts! (not (is-eq tx-sender (get creator group))) ERR-CREATOR-LEAVE)

    (map-set group-members group-id (filter-out members tx-sender))
    (map-set member-groups tx-sender (filter-out-uint (get-user-groups tx-sender) group-id))
    (print { event: "leave-group", group-id: group-id, member: tx-sender })
    (ok true)))

;; ---------------------------------------------------------------------------
;; filter helpers (Clarity has no closures with captured vars, so we use
;; data-vars to pass the target value into the filter predicate)
;; ---------------------------------------------------------------------------

(define-data-var filter-target-principal principal tx-sender)
(define-data-var filter-target-uint uint u0)

(define-private (keep-principal (item principal))
  (not (is-eq item (var-get filter-target-principal))))

(define-private (keep-uint (item uint))
  (not (is-eq item (var-get filter-target-uint))))

(define-private (filter-out (lst (list 10 principal)) (target principal))
  (begin
    (var-set filter-target-principal target)
    (filter keep-principal lst)))

(define-private (filter-out-uint (lst (list 20 uint)) (target uint))
  (begin
    (var-set filter-target-uint target)
    (filter keep-uint lst)))
