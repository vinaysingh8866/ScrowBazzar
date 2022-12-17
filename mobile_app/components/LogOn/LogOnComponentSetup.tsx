import { VStack } from "native-base";
import { useEffect } from "react";
import AddPersonalDetails from "./AddPersonalDetails";
import CreateWalletPin from "./CreateWalletPin";
import PhoneNumberVerification from "./PhoneNumberVerification";
import VerificationCode from "./VerificationCode";
import MobileNumberVerified from "./MobileNumberVerified";
import RecoveryPhrase from "./RecoveryPhrase";

const LogOnComponentSetup = ({
  setState,
  state,
}: {
  setState: any;
  state: number;
}) => {
  useEffect(() => {}, [state]);

  return (
    <VStack mx="auto" w="90%" my="-9%" h="90%" rounded="lg">
      {state === 0 && (
        <PhoneNumberVerification setState={setState} state={state} />
      )}

      {state === 1 && <VerificationCode setState={setState} state={state} />}
      {state === 2 && (
        <MobileNumberVerified setState={setState} state={state} />
      )}
      {state === 3 && <AddPersonalDetails setState={setState} state={state} />}
      {state === 4 && <RecoveryPhrase setState={setState} state={state} />}
      {state === 5 && <CreateWalletPin setState={setState} state={state} />}
    </VStack>
  );
};

export default LogOnComponentSetup;
