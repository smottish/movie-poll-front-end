// TODO SM (2021-10-27): This is just a placeholder for now,
// needs to be fully implemented.
class APIError extends Error {
  constructor(message, response) {
    super(message);
    this.response = response;
  }
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
      "Content-Type": "application/json",
    },
  })
    .then(checkStatus(200))
    .then((response) => response.json());
}
