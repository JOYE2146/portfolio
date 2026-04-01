---
title: "Firestore security rules that match your product"
slug: firebase-rules-patterns
date: "2026-03-20"
tags:
  - Firebase
  - Architecture
  - Security
type: blog
summary: "Model rules around ownership and document shape so your UI is not the only gatekeeper—patterns for read-mostly catalogs and admin writes."
author: "Yoseph"
---

## Principle

**Security rules are the source of truth** for who can read and write. Client checks are UX; rules are enforcement.

## Read-mostly public catalog

When documents are public but writes are restricted:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /projects/{id} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

Tune `admin` to your custom claims or a known service account pattern.

## Inline validation

Use `request.resource.data` to enforce required fields on create:

```javascript
allow create: if request.auth != null
  && request.resource.data.keys().hasAll(["title", "createdAt"])
  && request.resource.data.title is string
  && request.resource.data.title.size() > 0;
```

## Summary

Start strict, open reads only where the product truly needs public data, and test rules with the emulator before shipping.
