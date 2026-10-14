;; skela-registry
;; User registration, BNS-style username binding, and profile lookup for SKELA.
;;
;; One registration per principal. Usernames are globally unique (case-sensitive,
;; validated by the frontend). On success a `register` print event is emitted so
;; off-chain indexers can track new users.

;; ---------------------------------------------------------------------------
;; Constants / errors
;; ---------------------------------------------------------------------------

(define-constant ERR-ALREADY-REGISTERED (err u100))
(define-constant ERR-USERNAME-TAKEN     (err u101))
(define-constant ERR-EMPTY-USERNAME     (err u102))

;; ---------------------------------------------------------------------------
;; Data
;; ---------------------------------------------------------------------------

;; principal -> profile
(define-map users
  principal
  { username: (string-utf8 64), registered-at: uint })

;; username -> principal  (reverse index for uniqueness + resolution)
(define-map username-to-principal (string-utf8 64) principal)

;; running count of registered users
(define-data-var user-count uint u0)

;; ---------------------------------------------------------------------------
;; Read-only
;; ---------------------------------------------------------------------------

(define-read-only (get-user (addr principal))
  (map-get? users addr))

(define-read-only (resolve-username (username (string-utf8 64)))
  (map-get? username-to-principal username))

(define-read-only (is-registered (addr principal))
  (is-some (map-get? users addr)))

(define-read-only (get-user-count)
  (var-get user-count))

;; ---------------------------------------------------------------------------
;; Public
;; ---------------------------------------------------------------------------

(define-public (register (username (string-utf8 64)))
  (begin
    ;; non-empty username
    (asserts! (> (len username) u0) ERR-EMPTY-USERNAME)
    ;; one registration per principal
    (asserts! (is-none (map-get? users tx-sender)) ERR-ALREADY-REGISTERED)
    ;; username must be unique
    (asserts! (is-none (map-get? username-to-principal username)) ERR-USERNAME-TAKEN)

    (map-set users tx-sender
      { username: username, registered-at: stacks-block-height })
    (map-set username-to-principal username tx-sender)
    (var-set user-count (+ (var-get user-count) u1))

    (print { event: "register", who: tx-sender, username: username })
    (ok true)))
