# Basic Messenger Clone

A simple clone of Facebook Messenger built using ReactJS and Firebase. Most primary features of
Messenger have been ported to this app; however, more advanced features are currently pending. This
is one of my first solo, full scale projects, so I might make some pretty awful mistakes in the
docs/code. Feel free to create issues! 🎇

## Run Locally

Clone the project

```bash
  git clone https://github.com/Sang-Dang/simple-chat
```

Go to the project directory

```bash
  cd simple-chat
```

Install dependencies and include **Firebase Environment Variables in .env**

```bash
  pnpm install
```

Start the server

```bash
  pnpm dev
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`NODE_ENV`

`VITE_RECAPTCHA_SITE_KEY`

`VITE_FIREBASE_API_KEY`

`VITE_FIREBASE_AUTH_DOMAIN`

`VITE_FIREBASE_DATABASE_URL`

`VITE_FIREBASE_PROJECT_ID`

`VITE_FIREBASE_STORAGE_BUCKET`

`VITE_FIREBASE_MESSAGING_SENDER_ID`

`VITE_FIREBASE_APP_ID`

`VITE_FIREBASE_MEASUREMENT_ID`

## Features

-   Real-time text and image messaging
-   Create chat rooms
-   React to messages with live notifications
-   Reply to previous messages
-   View recipients' seen status for different messages

## Tech Stack

**Client:** React, Redux, TailwindCSS, NextUI

**Server:** Firebase - Firestore, Authentication, Realtime Database, Hosting

## Lessons Learned

-   Facebook Messenger is a bloody complex application.
-   Probably don't use NoSQL for a chat application (I already used it so, sunk cost fallacy, here
    we go)
-   Handling pagination and infinite scrolling in a chatbox... is complicated, but fun
-   Managing rerenders in a complex chat (with reactions, seen notifications, and typing indicators)
    can be mostly done with redux. In fact, most of my time wouldn't have been wasted if I'd used
    redux from the getgo.
-   Lack of sleep greatly inhibits the human cerebral, most notably when performing tasks closely
    tied to logic.

## Roadmap

-   Add video support
-   Add text image viewer
-   Implement pagination for chat room messages
-   Optimize bundle size
-   Basic Social Media (Posts, Comments, Likes) on Homepage Page
-   Account Details and Account Deletion on Profile Page
-   Add chat room options and deletion

## FAQ

#### Why are you doing this?

Honestly, I've been asking myself this question for 20 years... I don't know, I guess remaking
Facebook Messenger is fun!

#### When will you be finished?

Probably in one to two months. I'm lazy and inexperienced, so making this takes some time.

#### Are you coming down for dinner?

Yes mom!
