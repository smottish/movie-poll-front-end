import { nanoid } from "nanoid";

// TODO SM (2021-10-27): This is just a placeholder for now,
// needs to be fully implemented.
class APIError extends Error {
  constructor(message, response) {
    super(message);
    this.response = response;
  }
}

function getCommonHeaders() {
  return {
    "Anon-Authorization": getAnonUserId(),
  };
}

export function getAnonUserId() {
  let anonUserId = localStorage.getItem("anonUserId");
  if (anonUserId) {
    return anonUserId;
  }

  anonUserId = nanoid();
  localStorage.setItem("anonUserId", anonUserId);
  return anonUserId;
}

const checkStatus = (expected) => (response) => {
  if (response.status !== expected) {
    throw new APIError(`Unexpected status: ${response.status}`, response);
  }
  return response;
};

export function createPoll(poll) {
  return fetch("/polls", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getCommonHeaders(),
    },
    body: JSON.stringify(poll),
  })
    .then(checkStatus(201))
    .then((response) => response.json());
}

export function getPoll(id) {
  return fetch(`/polls/${id}`, {
    method: "GET",
    headers: {
      ...getCommonHeaders(),
    },
  })
    .then(checkStatus(200))
    .then((response) => response.json());
}

export function getPolls(id) {
  return fetch("/polls", {
    method: "GET",
    headers: {
      ...getCommonHeaders(),
    },
  })
    .then(checkStatus(200))
    .then((response) => response.json());
}

export function submitVote(pollId, choiceId) {
  return fetch("/votes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getCommonHeaders(),
    },
    body: JSON.stringify({ pollId, choiceId }),
  })
    .then(checkStatus(201))
    .then((response) => response.json());
}
