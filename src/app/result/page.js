"use client";
import { useState, useEffect, useMemo } from "react";
import GeneratedPitchScript from "../../components/GeneratedPitchScript";
import PitchDeckCreator from "../../components/PitchDeckCreator";
import Header from "../../components/Header";
// import { useRouter } from 'next/router';

export default function Result() {
  // const router = useRouter();
  // const { pitchDeckResult } = router.query;

  // const [pitchDeck, setPitchDeck] = useState(pitchDeckResult);
  const [pitchDeck, setPitchDeck] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  const { width, height } = useMemo(() => {
    return windowSize;
  }, [windowSize])

  useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount

  async function updatePitchDeck() {
    setIsLoading(true);
    let progress = 0;

    while (progress < 100) {
      await sleep(1000);
      progress += 25;
      setLoadingProgress(progress);
    }
    await sleep(1000);
    setPitchDeck([
      {
        title: "Introduction",
        contents:
          "Welcome to our company's pitch. We aim to revolutionize the tech industry with our innovative solutions.",
        time: 2, // in minutes
      },
      {
        title: "Hook",
        contents:
          "Imagine a world where technology seamlessly integrates into your daily life, making everything more efficient.",
        time: 1, // in minutes
      },
      {
        title: "Problem Statement",
        contents:
          "Current solutions in the market are either too expensive or lack the features necessary to meet the demands of modern consumers.",
        time: 2, // in minutes
      },
      {
        title: "Solution",
        contents:
          "Our product provides an affordable, feature-rich alternative that meets and exceeds consumer expectations.",
        time: 3, // in minutes
      },
      {
        title: "Market Opportunity",
        contents:
          "The market for tech solutions is growing rapidly, with an estimated value of $500 billion by 2025.",
        time: 2, // in minutes
      },
      {
        title: "Business Model",
        contents:
          "We operate on a subscription-based model, ensuring a steady revenue stream while offering competitive pricing.",
        time: 2, // in minutes
      },
      {
        title: "Traction",
        contents:
          "Since our launch, we have acquired over 10,000 users and secured partnerships with major industry players.",
        time: 2, // in minutes
      },
      {
        title: "Go-to-Market Strategy",
        contents:
          "Our strategy involves targeted marketing campaigns, strategic partnerships, and leveraging social media to build brand awareness.",
        time: 2, // in minutes
      },
      {
        title: "Strategy",
        contents:
          "We focus on continuous innovation and customer feedback to refine and expand our product offerings.",
        time: 1, // in minutes
      },
      {
        title: "Team",
        contents:
          "Our team comprises industry veterans with extensive experience in technology, marketing, and business development.",
        time: 1, // in minutes
      },
      {
        title: "Financials and Projections",
        contents:
          "We project a 50% growth in revenue over the next year, with a break-even point expected within 18 months.",
        time: 2, // in minutes
      },
      {
        title: "Closing",
        contents:
          "Thank you for your time. We look forward to your support and investment in our company's future.",
        time: 1, // in minutes
      },
    ]);
    setIsLoading(false);
    setLoadingProgress(0);
  }

  function resetPitchDeck() {
    setPitchDeck([
      {
        title: "Introduction",
        contents: null,
        time: null,
      },
      {
        title: "Hook",
        contents: null,
        time: null,
      },
      {
        title: "Problem Statement",
        contents: null,
        time: null,
      },
      {
        title: "Solution",
        contents: null,
        time: null,
      },
      {
        title: "Market Opportunity",
        contents: null,
        time: null,
      },
      {
        title: "Business Model",
        contents: null,
        time: null,
      },
      {
        title: "Traction",
        contents: null,
        time: null,
      },
      {
        title: "Go-to-Market",
        contents: null,
        time: null,
      },
      {
        title: "Strategy",
        contents: null,
        time: null,
      },
      {
        title: "Team",
        contents: null,
        time: null,
      },
      {
        title: "Financials and Projections",
        contents: null,
        time: null,
      },
      {
        title: "Closing",
        contents: null,
        time: null,
      },
    ]);
  }

  const sleep = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  return (
    <main className="h-screen w-screen flex flex-col pitch-deck-background">
      <GeneratedPitchScript
        pitchDeck={pitchDeck}
        isLoading={isLoading}
        loadingProgress={loadingProgress}
      />
    </main>
  );
}
