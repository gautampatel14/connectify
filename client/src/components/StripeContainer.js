import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import React from "react"
import PaymentForm from "./PaymentForm"

const PUBLIC_KEY = "pk_test_51Ns4h8SAkofUcsoWGLiwRy2LLBVSLDSyT95eEjAsqDsdklJIcnLm1iIJBMjkiB4PJXdDT6tX5edZn55x5wJfLFZs00S1mWZx36"

const stripeTestPromise = loadStripe(PUBLIC_KEY)

export default function StripeContainer() {
	return (
		<Elements stripe={stripeTestPromise}>
			<PaymentForm />
		</Elements>
	)
}