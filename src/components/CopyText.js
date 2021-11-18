import { useState, useEffect } from "react";
import { Flex, Text, getWidthClasses, getHeightClasses } from "./ui-kit";
import { DuplicateIcon } from "@heroicons/react/outline";
import classNames from "classnames";

async function copyToClipboard(text) {
  if (navigator && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      return false;
    }
  }

  return false;
}

export default function CopyText({ text }) {
  const [copiedText, setCopiedText] = useState("");

  useEffect(() => {
    let timer;
    if (copiedText !== "") {
      timer = setTimeout(() => setCopiedText(""), 1000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [copiedText]);

  const onCopy = async () => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedText("Copied!");
    } else {
      setCopiedText("Sorry, couldn't copy!");
    }
  };

  return (
    <Flex
      borderWidth={2}
      borderRadius="md"
      borderColor="gray.700"
      justifyContent="between"
      alignItems="center"
      p={4}
      my={5}
    >
      <Text size="lg">{text}</Text>
      {copiedText ? (
        <Text size="sm">{copiedText}</Text>
      ) : (
        <button onClick={onCopy}>
          <DuplicateIcon
            className={classNames(
              ...getWidthClasses(6),
              ...getHeightClasses(6)
            )}
          />
        </button>
      )}
    </Flex>
  );
}
