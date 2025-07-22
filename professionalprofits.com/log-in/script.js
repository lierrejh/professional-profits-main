/** @format */

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js";
import {
	getAuth,
	createUserWithEmailAndPassword,
	onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import {
	GoogleAuthProvider,
	signInWithPopup,
	signInWithEmailAndPassword,
	sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import {
	getFirestore,
	doc,
	setDoc,
	getDoc,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyDYNyy60egdnsHuycJa-86abDHrd9f7zzM",
	authDomain: "professional-profits.firebaseapp.com",
	projectId: "professional-profits",
	storageBucket: "professional-profits.appspot.com",
	messagingSenderId: "659626153048",
	appId: "1:659626153048:web:676b7439b59d6e2de9a62d",
	measurementId: "G-4DR3Q65DGK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export const db = getFirestore(app);

auth.languageCode = "en";
const provider = new GoogleAuthProvider();

const addUserToFirestore = async (user) => {
	try {
		const userDocRef = doc(db, "users", user.uid);
		const userDoc = await getDoc(userDocRef);

		if (!userDoc.exists()) {
			await setDoc(userDocRef, {
				// uid: user.uid,
				email: user.email,
				name: user.displayName, // Store the user's name
				membershipStatus: "waitlist", // Default to waitlist
				invited: false,
				createdAt: new Date()

			});
			console.log("User added to Firestore");
			await sendWaitlistEmail(user.email);
		} else {
			console.log("User already exists in Firestore");
		}
	} catch (error) {
		console.error("Error checking or adding user to Firestore:", error.message);
	}
};

// Sends an email notification by adding document to 'mail' collection
const sendWaitlistEmail = async (email) => {
	try {
		await setDoc(doc(db, "mail", email), {
			to: email,
			message: {
				subject: "Welcome to the Waitlist!",
				text: "Thank you for joining our platform. We’ll let you know once you’re off the waitlist!"
			}
		});
		console.log("Waitlist email triggered for", email);
	} catch (error) {
		console.error("Error sending waitlist email:", error.message);
	}
};

const googleLogin = document.getElementById("google-login-btn");
googleLogin.addEventListener("click", function (event) {
  event.preventDefault();
	signInWithPopup(auth, provider)
		.then((result) => {
			const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
			const user = auth.currentUser;
			setSuccess("email-login");
			setSuccess("password-login");
			setSuccessMessage("password-login", "User logged in.");
      addUserToFirestore(user);
      onAuthStateChanged(auth, (user) => {
  if (user) {
        const uid = user.uid;
        window.location.href = "../dashboard/index.html";
      }
    })
      
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			alert(errorMessage);
		});
});

const googleCreate = document.getElementById("google-create-btn");
googleCreate.addEventListener("click", function (event) {
  event.preventDefault();
	signInWithPopup(auth, provider)
		.then((result) => {
      event.preventDefault();
			const credential = GoogleAuthProvider.credentialFromResult(result);
			const user = auth.currentUser;
			setSuccess("newName");
			setSuccess("newEmail");
			setSuccess("newPassword");
			setSuccessMessage(
				"newPassword",
				"Account created successfully. User logged in."
			);
			addUserToFirestore(user);
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			alert(errorMessage);
		});
});

function setSuccess(inputId) {
	const inputElement = document.getElementById(inputId);
	inputElement.classList.remove("error");
	inputElement.classList.add("success"); // Add success class
}

function setSuccessMessage(inputId, message) {
	const inputElement = document.getElementById(inputId);
	inputElement.classList.remove("error");
	inputElement.classList.add("success"); // Add success class
	const successElement = document.getElementById(inputId + "Error");
	if (successElement) {
		successElement.innerText = message;
		successElement.style.display = "block"; // Ensure the success message is shown
		successElement.style.color = "green"; // Set the message color to green
	}
}

// const newSubmit = document.getElementById("newSubmit");
// newSubmit.addEventListener("click", function (event) {
//   event.preventDefault();

//   const newEmail = document.getElementById("newEmail").value;
//   const newPassword = document.getElementById("newPassword").value;

//   createUserWithEmailAndPassword(auth, newEmail, newPassword)
//     .then((userCredential) => {
//       // Signed up
//       const user = userCredential.user;
//       alert("User signed up" + user.email + user.displayName);
//     })
//     .catch((error) => {
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       alert(errorMessage);
//     });
// });

const container = document.getElementById("container");
const registerbtn = document.getElementById("register");
const loginbtn = document.getElementById("login");

registerbtn.addEventListener("click", () => {
	container.classList.add("active");
});

loginbtn.addEventListener("click", () => {
	container.classList.remove("active");
});

// const loginUser = document.getElementById("login-user-btn");
// loginUser.addEventListener("click", function(event) {
// event.preventDefault();
// const loginEmail = document.getElementById("email-login").value;
// const loginPassword = document.getElementById("password-login").value;
// signInWithEmailAndPassword(auth, loginEmail, loginPassword)
// 	.then((userCredential) => {
// 		// Login successful
// 		console.log("User signed in:", userCredential.user);
// 	})
// 	.catch((error) => {
// 		// Login failed, show alert with error message
// 		var errorCode = error.code;
// 		var errorMessage = error.message;

// 		// You can customize the alert message based on the error code
// 		if (errorCode === "auth/user-not-found") {
// 			alert("No user found with this email. Please check your credentials.");
// 		} else if (errorCode === "auth/wrong-password") {
// 			alert("Incorrect password. Please try again.");
// 		} else {
// 			alert("Login failed: " + errorMessage);
// 		}
// 	});
// });

document
	.getElementById("newSubmit")
	.addEventListener("click", function (event) {
		event.preventDefault(); // Prevent form from submitting and refreshing the page
		validateSignUp();
	});

// Event listener for the sign-in form submission
document
	.getElementById("login-user-btn")
	.addEventListener("click", function (event) {
		event.preventDefault(); // Prevent form from submitting and refreshing the page
		validateSignIn();
	});

function validateSignUp() {
	// Clear previous error messages
	clearErrors();

	const name = document.getElementById("newName").value.trim();
	const email = document.getElementById("newEmail").value.trim();
	const password = document.getElementById("newPassword").value.trim();

	let valid = true;

	if (!name) {
		setError("newName", "Name is required.");
		valid = false;
	}

	if (!email) {
		setError("newEmail", "Email is required.");
		valid = false;
	} else if (!validateEmail(email)) {
		setError("newEmail", "Please enter a valid email address.");
		valid = false;
	}

	if (!password) {
		setError("newPassword", "Password is required.");
		valid = false;
	} else if (password.length < 6) {
		setError("newPassword", "Password must be at least 6 characters long.");
		valid = false;
	}

	if (valid) {
		// Proceed with form submission or Firebase authentication
		const newEmail = document.getElementById("newEmail").value;
		const newPassword = document.getElementById("newPassword").value;
		const newName = document.getElementById("newName").value.trim();

		createUserWithEmailAndPassword(auth, newEmail, newPassword)
			.then((userCredential) => {
				// Signed up
				const user = userCredential.user;
				setSuccess("newName");
				setSuccess("newEmail");
				setSuccess("newPassword");
				setSuccessMessage(
					"newPassword",
					"Account created successfully. Please sign in."
				);
				addUserToFirestore({
					uid: user.uid,
					email: email,
					displayName: name, // Pass name to Firestore
				});
			})
			.catch((error) => {
				const errorCode = error.code;

				if (errorCode === "auth/email-already-in-use") {
					setError("newEmail", "This email is already in use.");
				} else {
					setError(
						"newSubmit",
						"Something didn't go to plan, please try again."
					);
				}
			});
	}
}

function validateSignIn() {
	// Clear previous error messages
	clearErrors();

	const email = document.getElementById("email-login").value.trim();
	const password = document.getElementById("password-login").value.trim();

	let valid = true;

	if (!email) {
		setError("email-login", "Email is required.");
		valid = false;
	} else if (!validateEmail(email)) {
		setError("email-login", "Please enter a valid email address.");
		valid = false;
	}

	if (!password) {
		setError("password-login", "Password is required.");
		valid = false;
	}

	if (valid) {
		// Proceed with Firebase authentication
		const loginEmail = document.getElementById("email-login").value;
		const loginPassword = document.getElementById("password-login").value;
		signInWithEmailAndPassword(auth, loginEmail, loginPassword)
			.then((userCredential) => {
				// Login successful
				const user = userCredential.user;
				setSuccess("email-login"); // Set border to green on success
				setSuccess("password-login");
				setSuccessMessage("password-login", "User signed in");
        onAuthStateChanged(auth, (user) => {
  if (user) {
        const uid = user.uid;
				window.location.href = "/professionalprofits.com/dashboard/index.html";
  }
			})
    })
			.catch((error) => {
				// Login failed, show alert with error message
				var errorCode = error.code;
				var errorMessage = error.message;

				// You can customize the alert message based on the error code
				if (errorCode === "auth/invalid-credential") {
					setError("email-login", "This email or password does not exist.");
					setError("password-login", "");
				} else {
					setError(
						"email-login",
						"This account has been locked for too many failed attempts. Please reset password."
					);
				}
			});
	}
}

// Modify your clearErrors function to also remove the success class
function clearErrors() {
	const inputs = document.querySelectorAll("input");
	inputs.forEach((input) => {
		input.classList.remove("error");
		input.classList.remove("success"); // Remove success class when clearing errors
	});

	const errorMessages = document.querySelectorAll(".error");
	errorMessages.forEach((error) => (error.innerText = ""));
}

function setError(inputId, message) {
	const inputElement = document.getElementById(inputId);
	inputElement.classList.add("error");
	const errorElement = document.getElementById(inputId + "Error");
	if (errorElement) {
		errorElement.innerText = message;
		errorElement.style.display = "block"; // Ensure the error message is shown
	}
}

function validateEmail(email) {
	const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return re.test(String(email).toLowerCase());
}

// Reset password
// const reset = document.getElementById("reset-password");
// reset.addEventListener("click", function (event) {
// 	event.preventDefault();
// 	const email = document.getElementById("loginEmail").value;
// 	sendPasswordResetEmail(auth, email)
// 		.then(() => {
// 			alert("Password reset email sent");
// 		})
// 		.catch((error) => {
// 			const errorCode = error.code;
// 			const errorMessage = error.message;
// 			alert(errorMessage);
// 		});
// });

document
	.getElementById("forgot-password")
	.addEventListener("click", function (event) {
		event.preventDefault(); // Prevent the default action of the link

		const loginEmail = document.getElementById("email-login").value;

		// Clear previous errors
		clearErrors();

		if (!loginEmail) {
			setError("email-login", "Enter your email to reset.");
		} else if (!validateEmail(loginEmail)) {
			setError("email-login", "Please enter a valid email address.");
		} else {
			// Proceed with Firebase password reset
			sendPasswordResetEmail(auth, loginEmail)
				.then(() => {
					// Email sent successfully
					setSuccess("email-login");
					setSuccessMessage(
						"email-login",
						"A reset link has been sent to your email if you have an account."
					);
				})
				.catch((error) => {
					const errorCode = error.code;

					if (errorCode === "auth/invalid-credential") {
						setError("email-login", "This email does not exist.");
					} else {
						setError("email-login", error.message);
					}
				});
		}
	});
