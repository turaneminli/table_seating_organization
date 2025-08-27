import { useEffect, useState } from "react";
import { encodePlan, decodePlan } from "../utils/encode.js";

export const useHashState = (initial) => {
  const [state, setState] = useState(initial);

  useEffect(() => {
    const read = () => {
      const h = location.hash.replace(/^#/, "");

      if (!h) return;

      const parsed = decodePlan(h);
      if (parsed) setState(parsed);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  const set = (v) => {
    setState(v);
    const encoded = encodePlan(v);
    history.replaceState(null, "", `#${encoded}`);
  };

  return [state, set];
};
