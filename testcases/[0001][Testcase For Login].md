### TC-LOGIN-001: Successful login

**Pre-condition:** Valid account exists

| Step | Action                    |
| ---- | ------------------------- |
| 1    | Open login page           |
| 2    | Enter username & password |
| 3    | Click Login               |

**Expected:** Redirect to Dashboard, show user menu

---

### TC-LOGIN-002: Failed login - wrong password

| Step | Action                           |
| ---- | -------------------------------- |
| 1    | Open login page                  |
| 2    | Enter username & password(Wrong) |
| 3    | Click Login                      |

**Expected:** Show error "Wrong username/password"

---

### TC-LOGIN-003: Failed login - empty username

| Step | Action                           |
| ---- | -------------------------------- |
| 1    | Open login page                  |
| 2    | Enter username(Empty) & password |
| 3    | Click Login                      |

**Expected:** Show error "Username cannot be empty"

---

### TC-LOGIN-004: Failed login - empty password

| Step | Action                           |
| ---- | -------------------------------- |
| 1    | Open login page                  |
| 2    | Enter username & password(Empty) |
| 3    | Click Login                      |

**\*Expected:** Show error "Password cannot be empty"
