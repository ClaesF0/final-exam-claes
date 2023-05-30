import { Configuration, OpenAIApi } from "openai";
import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../../src/index.css";

const apiKey = import.meta.env.VITE_REACT_APP_API_KEY;
const organization = import.meta.env.VITE_REACT_APP_ORGANIZATION;

const configuration = new Configuration({
  organization: organization,
  apiKey: apiKey,
});

const openai = new OpenAIApi(configuration);

function ChatBot() {
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const chat = async (e, message) => {
    e.preventDefault();

    if (!message) return;
    setIsTyping(true);
    scrollTo(0, 1e10);

    let msgs = chats;
    msgs.push({ role: "You", content: message });
    setChats(msgs);

    setMessage("");

    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt:
          `Assume the role of "Mr Banana" the cheery host for Holidaze, an Airbnb-like site made by www.github.com/claesf0/ . The following is what you know: All navigational stuff is in navbar. Here customer find links to sign up, log in, or become a venue manager. Once logged in, customer can book stays at listings either from the front page or by using the search bar. Site architecture: Homepage w accommodations: /Listings click one to see details of a specific listing. /Signup: Allows users to create an account /Login: Allows registered users to log in. /Profiles/:name: Displays user profiles /BecomeVenueManager: Enables users to become venue managers/MakeAListing: Allows venue managers to create listings.  Stay in character as Mr Banana the holidaze host and answer the following question:` +
          { message },
        max_tokens: 1033,
        top_p: 1,
        n: 1,
        stream: false,
        stop: ["."],
      });
      msgs.push({ role: "Mr Banana", content: response.data.choices[0].text });
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
    <>
      <div className="fixed bottom-20 right-4 z-50">
        <button
          className={`chatbot-toggle ${showChat ? "active" : ""}`}
          onClick={() => setShowChat(!showChat)}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "4px",
            width: "50px",
            height: "50px",
            backgroundColor: "#0077b5",
            color: "white",
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            zIndex: "10",
            margin: "10px",
          }}
        >
          <i className="fa fa-comment">{showChat ? "Exit" : "Chat"}</i>
        </button>
        {showChat && (
          <main className={`chat-main ${showChat ? "block z-20 " : ""}`}>
            <h1
              className="text-center font-semibold"
              style={{
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Chatbot
            </h1>

            <form
              className="chat-form"
              onSubmit={(e) => chat(e, message)}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                position: "sticky",
                bottom: "50px",
                zIndex: "10",
                padding: "0 10px",
                margin: "0 10px",
              }}
            >
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{
                  flex: "1",
                  width: "200px",
                  height: "40px",
                  border: "none",
                  padding: "10px",
                  fontSize: "1.2rem",
                  backgroundColor: "#0077b5",
                  borderRadius: "4px",
                  color: "white",
                }}
              />
              <button
                type="submit"
                style={{
                  border: "none",
                  backgroundColor: "#0077b5",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
              >
                Send
              </button>
            </form>

            <section
              className="chat-section"
              style={{
                position: "fixed",
                bottom: "90px",
                right: "20px",
                width: "300px",
                maxHeight: "400px",
                backgroundColor: "white",
                borderRadius: "8px",
                border: "1px solid #ccc",
                overflowY: "auto",
                padding: "10px",
                zIndex: "10",
                margin: "30px 0",
                display: showChat ? "block" : "none",
              }}
            >
              {chats &&
                chats.map((chat, index) => (
                  <p
                    key={index}
                    className={chat.role === "user" ? "user_msg" : ""}
                    style={{
                      textAlign: chat.role === "user" ? "right" : "left",
                      marginLeft: chat.role === "user" ? "30%" : "",
                      display: "flex",
                      flexDirection:
                        chat.role === "user" ? "row-reverse" : "row",
                    }}
                  >
                    <span>
                      <b>{chat.role}</b>
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
          </main>
        )}
      </div>
    </>
  );
}

export default ChatBot;
