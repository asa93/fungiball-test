import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, useAccount } from "wagmi";

import { Account } from "./account";
import { WalletOptions } from "./WalletOptions";
import { useSignMessage } from "wagmi";
import { configz } from "./config";
import useAxios from "axios-hooks";

import { useState, useEffect } from "react";

import { Grid, Drawer, Button, TextField, Divider } from "@mui/material";

import axios from "axios";

const queryClient = new QueryClient();

function ConnectWallet() {
  const { isConnected } = useAccount();

  if (isConnected) return <Account />;
  return <WalletOptions />;
}

function Sign() {
  const { signMessage, signMessageAsync } = useSignMessage({ configz });
  const { isConnected } = useAccount();

  const [{ data, error }] = useAxios({
    url: "/api/auth/message",
  });

  async function sign() {
    const signature = await signMessageAsync({
      message: data.message,
    });
    console.log("signature", signature);
  }

  return isConnected && <button onClick={sign}>Sign message</button>;
}

function TopBar() {
  const { isConnected, address } = useAccount();
  return (
    <Drawer className="topbar" variant="persistent" anchor={"top"} open={true}>
      {isConnected ? address : "not connected"}
    </Drawer>
  );
}

function Quiz() {
  const { isConnected, address } = useAccount();

  const [count, setCount] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(0);

  const [{ data: quiz, error }] = useAxios({
    url: "/api/quiz",
  });

  const handleClick = async function (answer: string) {
    let answers_ = [...answers];
    answers_.push({ answer: answer });
    setAnswers(answers_);
    setCount(count + 1);

    if (count === quiz.length - 1) {
      const resp: AxiosResponse<any, any> = await axios.post(
        "/api/answer",
        answers_
      );

      console.log("result2", resp);
      setResult(resp?.data?.count);
    }
  };
  if (!isConnected || !quiz) return null;

  const question = quiz[count];

  console.log("result", result);
  if (count >= quiz.length) {
    if (result < quiz.length) return <span>Failed :( </span>;
    else return <span> success :)</span>;
  } else
    return (
      <Grid>
        <h1>{question?.question} </h1>

        {question.options.map((o) => (
          <Grid item md={4} key={1}>
            <Button onClick={() => handleClick(o)}>{o}</Button>
          </Grid>
        ))}
      </Grid>
    );
}

export default function App() {
  return (
    <WagmiProvider config={configz}>
      <QueryClientProvider client={queryClient}>
        <>
          <TopBar />

          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Grid md={8} className="login">
              {" "}
              <h1>Mon test technique</h1>
              <ConnectWallet />
              <Sign />
            </Grid>

            <Quiz />
          </Grid>
        </>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
