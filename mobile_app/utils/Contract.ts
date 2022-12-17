import { get, onValue, ref, update } from "firebase/database";
import db from "../firebase";
import { getValueFor } from "./Storage";

export async function getBalanceFromContract() {
    let email = await getValueFor("email");
    email = email.replace(".", "_");
    let bal;
    const balance = await fetch("http://157.230.188.72:8080/balance_of", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user: email,
        }),
    });
    const userRef = ref(db, "users/" + email + "/info");

    const b = await get(userRef);
    const balanceValue = b.val().balance;
    if (balance.status === 200) {
        console.log(balance);
        const bValue = await balance.json();
        if (bValue.balance !== balanceValue) {
            bal = bValue.balance;
            update(userRef, {
                balance: bValue.balance,
            });
        }
        else {
            bal = balanceValue;
        }
    }
    return balanceValue;
}

export async function addFundsToContract(amount: number) {
    let email = await getValueFor("email");
    email = email.replace(".", "_");
    const userRef = ref(db, "users/" + email + "/info");
    const balance = await get(userRef);
    const balanceValue = balance.val().balance;
    const mintTokens = await fetch("http://157.230.188.72:8080/mint_tokens", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user: email,
            amount: parseInt(amount.toString()),
        }),
    });
    update(userRef, {
        balance: parseInt(amount.toString()) + parseInt(balanceValue),
    });
    const b = await mintTokens.json();
    return b;
}