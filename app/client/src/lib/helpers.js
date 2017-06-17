import request from "superagent";

export function getEndpointBaseURL() {
  let endpointBaseURL;
  if (process.env.NODE_ENV === "production") {
    endpointBaseURL = "https://graphoverflow.dgraph.io";
  } else {
    endpointBaseURL = "http://127.0.0.1";
  }

  return endpointBaseURL;
}

// runQuery makes a post request to the server to run query and returns a
// promise that resolves with a response
export function runQuery(queryText) {
  const endpointBaseURL = getEndpointBaseURL();

  return request
    .post(`${endpointBaseURL}:8080/query`)
    .send(queryText)
    .then(res => {
      return JSON.parse(res.text);
    });
}

// parseTagString parses the string denoting a list of tags and returns an array
// of tags. tagString is of format: `<tag1><tag2>...<tagn>`
export function parseTagString(tagString) {
  let ret = [];
  let currentTag = "";
  let reading = false;

  for (let i = 0; i < tagString.length; i++) {
    const char = tagString[i];

    if (char === "<") {
      reading = true;
      continue;
    } else if (char === ">") {
      reading = false;
    }

    if (!reading && currentTag !== "") {
      ret.push(currentTag);
      currentTag = "";
    }
    if (reading) {
      currentTag += char;
    }
  }

  return ret;
}

// kFormat formats the number with suffix 'k' if greater than 999
export function kFormat(num) {
  return num > 999 ? (num / 1000).toFixed(1) + "k" : num;
}

export function trimStr(str, maxLen = 100) {
  if (str.length < maxLen) {
    return str;
  }

  return str.substring(0, maxLen - 3) + "...";
}

export function stripTags(str = "") {
  return str.replace(/(<([^>]+)>)/gi, "");
}
