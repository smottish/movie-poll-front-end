import { useLayoutEffect, useState } from "react";

export default function useMedia(query) {
  const [matches, setMatches] = useState(false);

  useLayoutEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = (ev) => setMatches(ev.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);

    // If the value of 'query' changed since the previous render,
    // then we want run our cleanup function to tear down the
    // old media query, and run our effect again to setup the
    // new one. This is accomplished by including 'query' in the
    // useEffect dependencies array. Our effect also depends on
    // the value of 'matches', so it needs to go into the array
    // as well.
  }, [query, matches]);

  return matches;
}
