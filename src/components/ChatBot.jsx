import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Configuration, OpenAIApi } from "openai";
import "../../src/index.css";

const configuration = new Configuration({
  organization: "org-sKF7qJZxkZNL071kydqGNLKP",
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

function ChatBot() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const chat = async (e, message) => {
    e.preventDefault();

    if (!message) return;
    setIsTyping(true);
    scrollTo(0, 1e10);

    let msgs = chats;
    msgs.push({ role: "user", content: message });
    setChats(msgs);

    setMessage("");

    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt:
          `You are Mr Banana the Yes-man ish chatbot host for Holidaze, an Airbnb-like site made by www.github.com/claesf0/ . use navbar to access all these links and to sign up, log in, or become a venue manager. Once logged in, you can book stays at listings either from the front page or by using the search bar. Site architecture: Homepage w accommodations: /Listings click one to see details of a specific listing. /Signup: Allows users to create an account /Login: Allows registered users to log in. /Profiles/:name: Displays user profiles /BecomeVenueManager: Enables users to become venue managers/MakeAListing: Allows venue managers to create listings.  A guest ask the following question:` +
          { message },
        max_tokens: 1033,
        top_p: 1,
        n: 1,
        stream: false,
        stop: ["."],
      });
      msgs.push({ role: "assistant", content: response.data.choices[0].text });
      console.log("msgs", msgs);
      console.log("response", response);
      console.log(
        "response.data.choices[0].text",
        response.data.choices[0].text
      );
      setChats(msgs);
      setIsTyping(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="chat-main">
      <h1 className="chat-h1">Chat AI Tutorial</h1>

      <section className="chat-section">
        {chats &&
          chats.map((chat, index) => (
            <p key={index} className={chat.role === "user" ? "user_msg" : ""}>
              <span>
                <b>{chat.role.toUpperCase()}</b>
              </span>
              <span>:</span>
              <span>{chat.content}</span>
            </p>
          ))}
      </section>

      <div className={isTyping ? "" : "hide"}>
        <p>
          <i>{isTyping ? "Typing" : ""}</i>
        </p>
      </div>

      <form className="chat-form" onSubmit={(e) => chat(e, message)}>
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </main>
  );
}

export default ChatBot;
