# Testing

In the future, all development will be done using the development container. For now, the react native application can be tested locally for development.
To run locally, follow the steps given down below.

## Steps

1. Ensure your pwd is `frontend`
2. Run `npm install` to retrieve 'node_modules' and '.expo' which are not stored in git.
3. Solve any errors that are printed out in the terminal and run `npm start` to run the app.
4. The web app should automatically pop up. If it doesn't, input 'w' in the terminal to run it.
5. To open the app on mobile, download the 'Expo Go' app on your mobile device. Note that, this only works on iOS devices.
   Once it is downloaded, scan the QR code displayed in the terminal and the app will open up in the Expo Go app.
   If there is no QR code in the terminal, typing 'c' in the terminal should reproduce it.
6. You can start developing and see your live changes on the app now. Note: If you are not seeing your changes,
   you might need to rerun the app.
7. To bring the app down, just press 'Control + C' in your terminal.
