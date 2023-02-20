# App

`App` represents a running Oryx application.

It allows you to:

- Interact with registered plugins during the construction phase (`findPlugin`/`requirePlugin`)
- Wait for application ready state (`whenReady`)
- Destroy and cleanup application (`destroy`)
