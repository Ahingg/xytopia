import { useState } from "react";
import { PhaserGame } from "./components/PhaserGame";
import { PortfolioView } from "./components/PortfolioView";

type AppView = "game" | "portfolio";

function App() {
    const [currentView, setCurrentView] = useState<AppView>("game");

    // Listen for portfolio navigation from the game
    if (typeof window !== "undefined") {
        window.addEventListener("navigateToPortfolio", () => {
            setCurrentView("portfolio");
        });
    }

    return (
        <div className="w-screen h-screen overflow-hidden bg-portfolio-dark">
            {currentView === "game" && (
                <div className="relative w-full h-full">
                    <PhaserGame />
                    <div className="absolute top-4 left-4 z-10">
                        <button
                            onClick={() => setCurrentView("portfolio")}
                            className="px-4 py-2 bg-portfolio-accent text-white rounded-md hover:bg-portfolio-light transition-colors duration-200 font-modern font-medium"
                        >
                            Portfolio
                        </button>
                    </div>
                </div>
            )}

            {currentView === "portfolio" && (
                <PortfolioView onBackToGame={() => setCurrentView("game")} />
            )}
        </div>
    );
}

export default App;
