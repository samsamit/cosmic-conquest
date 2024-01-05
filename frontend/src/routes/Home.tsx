import LinkButton from "@/components/custom/buttons/LinkButton";
import { Component } from "solid-js";

const Home: Component = () => {
  return (
    <div class="container pt-4 flex flex-col gap-2">
      <h1>Home</h1>
      <LinkButton href="/profile">Profile</LinkButton>
      <LinkButton href="/game">Create game</LinkButton>
    </div>
  );
};

export default Home;
