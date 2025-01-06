# Lostfound Project


Welcome to My Lostfound Project! 🎒💡

This application project is designed to help users report, search for, and manage lost and found items effortlessly. Whether it's a misplaced wallet, a lost phone, or a forgotten umbrella, this project provides a streamlined solution to connect people and their belongings.

### Features:
- **Report Lost Items:** Submit details about lost items with tags, descriptions, and dates.
- **Browse Found Items:** Explore a list of found items to check if your missing item has been located.
- **User-Friendly Interface:** A responsive design for smooth navigation and accessibility ( 😁 am work in progress in the UX space ) .

Check out the repository to learn more, and feel free to contribute or suggest improvements! 🚀



## Prerequisites

Before starting, ensure you have the following installed:

- Node.js (version 14 or higher)
- npm or yarn
- Firebase project configured (with Authentication, Firestore, and Storage enabled)

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/Atupele4/lostfound.git
   cd lostfound
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up Firebase:

   - Go to the [Firebase Console](https://console.firebase.google.com/).
   - Create a new project or select an existing one.
   - Enable **Authentication** (Email/Password or any other providers you need).
   - Enable **Cloud Firestore** and set up security rules as needed.
   - Enable **Storage** and set up security rules.

4. Add Firebase configuration:

   - Create a `.env` file in the project root:
     ```env
     REACT_APP_FIREBASE_API_KEY=<your-api-key>
     REACT_APP_FIREBASE_AUTH_DOMAIN=<your-auth-domain>
     REACT_APP_FIREBASE_PROJECT_ID=<your-project-id>
     REACT_APP_FIREBASE_STORAGE_BUCKET=<your-storage-bucket>
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<your-messaging-sender-id>
     REACT_APP_FIREBASE_APP_ID=<your-app-id>
     ```
   - Replace placeholders with your Firebase project credentials.

5. Start the development server:

   ```bash
   npm start
   ```

6. Open your browser and navigate to `http://localhost:3000` to view the application.

## Application Objects in firebase Collections

### User Object

- Users can sign up, log in, and log out.
- Example authentication object:
  ```json
  {
    "uid": "123456789",
    "email": "user@example.com",
    "displayName": "John Doe",
    "photoURL": "https://example.com/photo.jpg"
  }
  ```

### Users Object

- Firestore is used for structured data storage.
- Example Firestore document structure:

  ```json
  {
    "firstName": "Atupele",
    "lastName": "Mboya",
    "email": "testmail@email.com",
    "phoneNumber": "0977XXXXXX",
    "incidents": [
      "0gShX48of3SDEY9JcUAd",
      "NtVW5DoTxJcjqTr9TBfo",
      "XSmFty3sp11pbQ2pdIZj",
      "iyJDtPcVHTSHWie7XecQ",
      "zpY89akaWSNznpQCqmr4",
      "lyI5nFM1nUxAOpTHUX7s"
    ],
    "dateOfBirth": "1989-04-11",
    "uid": "KDzUq2YyrHhrL1WST%KYGbfAgz2",
    "createdAt": {
      "seconds": 1735778687,
      "nanoseconds": 972000000
    }
  }
  ```

### Incident Object

- This is a user onject
- "uid" is the Firebase Auth uid added to the Users Collection.

  ```json
  {
    "status": "Unclaimed",
    "description": "Incident Description Given",
    "locationLngLat": {
      "lat": -15.425640667456857,
      "lng": 28.280156343808602
    },
    "uid": "KDzUq2YyrHhrL1SCTKyKYGbfAgz2",
    "location": "Lusaka",
    "imagePaths": [
      "https://firebasestorage.googleapis.com/v0/b/myexpensetracker-6fed6.appspot.com/o/IncidentsPhotos%2FlyI5nFM1nUxAOpSDEF7s%2FScreenshot%202024-11-26%20170303.png?alt=media&token=650bb210-b02a-4677-a2f7-71e61357d9cd"
    ],
    "phoneNumber": "0977XXXXXX",
    "dateLost": "2025-01-06",
    "tags": ["Tablets"]
  }
  ```


## Deployment

To deploy the application:

1. Build the project:

   ```bash
   npm run build
   ```

2. Deploy to a hosting service (e.g., Firebase Hosting, Vercel, Netlify):
   - For Firebase Hosting:
     ```bash
     npm install -g firebase-tools
     firebase login
     firebase init hosting
     firebase deploy
     ```

## Contributing

Feel free to contribute to this project by submitting issues or pull requests.

## License

This project is licensed under the MIT License.
