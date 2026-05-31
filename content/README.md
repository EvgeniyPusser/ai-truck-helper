# Holy Move Content

This folder stores prepared social media content for Holy Move.

## Structure

```text
content/
  posts/      JSON files with post text, date, platforms, and image path
  images/     images for posts
```

## Post format

Each post is a JSON file:

```json
{
  "id": "hm-2026-06-01-001",
  "status": "draft",
  "scheduledDate": "2026-06-01",
  "platforms": ["facebook", "instagram", "threads"],
  "title": "Moving is not just logistics",
  "text": "Post text here...",
  "image": "content/images/hm-2026-06-01-001.jpg",
  "hashtags": ["HolyMove", "MovingWithSoul", "LosAngeles"]
}
```

## Status values

- `draft` — prepared but not ready
- `ready` — ready to publish
- `posted` — already published
- `skip` — do not publish

## Important

Do not store Meta access tokens, passwords, cookies, or private keys in this repository.
