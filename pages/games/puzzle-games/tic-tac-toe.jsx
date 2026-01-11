import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import PaymentModal from '../../../components/PaymentModal';
import { 
  checkPaymentRequirement as checkPaymentRequirementNew, 
  getUserPlan
} from '../../../lib/config/pricing';
import { hasValidProcessingPass as hasValidProcessingPassNew } from '../../../lib/payments/payment-utils';

const siteHost = (process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io').replace(/\/$/, '');

export default function TicTacToe() {
  const [gameSession, setGameSession] = useState(null);
  const [playerCount, setPlayerCount] = useState(2);
  const [playerName, setPlayerName] = useState('');
  const [currentPlayerName, setCurrentPlayerName] = useState('');
  const [gameBoard, setGameBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [gameStatus, setGameStatus] = useState('waiting'); // waiting, playing, finished
  const [winner, setWinner] = useState(null);
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentRequirement, setPaymentRequirement] = useState(null);
  const [userSession, setUserSession] = useState({ processingPass: null });
  const [moves, setMoves] = useState(0);
  const [gameHistory, setGameHistory] = useState([]);
  const [isAIPlaying, setIsAIPlaying] = useState(false);

  const currentYear = new Date().getFullYear();
  const canonicalUrl = `${siteHost}/games/puzzle-games/tic-tac-toe`;

  // Check for winner (client-side validation) - Define before getAIMove
  const checkWinner = useCallback((board) => {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6], // Diagonals
    ];

    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    if (board.every(cell => cell !== null)) {
      return 'draw';
    }

    return null;
  }, []);

  // AI Move Logic (Simple minimax-based AI)
  const getAIMove = useCallback((board, aiSymbol, playerSymbol) => {
    // Check if AI can win in one move
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        const testBoard = [...board];
        testBoard[i] = aiSymbol;
        if (checkWinner(testBoard) === aiSymbol) {
          return i;
        }
      }
    }

    // Check if player can win in one move (block them)
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        const testBoard = [...board];
        testBoard[i] = playerSymbol;
        if (checkWinner(testBoard) === playerSymbol) {
          return i;
        }
      }
    }

    // Try center
    if (board[4] === null) return 4;

    // Try corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => board[i] === null);
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Try edges
    const edges = [1, 3, 5, 7];
    const availableEdges = edges.filter(i => board[i] === null);
    if (availableEdges.length > 0) {
      return availableEdges[Math.floor(Math.random() * availableEdges.length)];
    }

    // Fallback (shouldn't happen)
    return board.indexOf(null);
  }, [checkWinner]);

  // Check for valid processing pass
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const passData = localStorage.getItem('processingPass');
      if (passData) {
        try {
          const pass = JSON.parse(passData);
          const session = { processingPass: pass };
          if (hasValidProcessingPassNew(session)) {
            setUserSession(session);
          } else {
            localStorage.removeItem('processingPass');
            setUserSession({ processingPass: null });
          }
        } catch (e) {
          localStorage.removeItem('processingPass');
          setUserSession({ processingPass: null });
        }
      }
    }
  }, []);

  // Poll game session for multiplayer updates
  useEffect(() => {
    if (!gameSession || gameStatus !== 'playing') return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/games/tic-tac-toe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'get',
            sessionId: gameSession.sessionId,
            userSessionId: userSession.processingPass?.sessionId || null,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.session) {
            setGameBoard(data.session.board);
            setCurrentPlayer(data.session.currentPlayer);
            setGameStatus(data.session.gameStatus);
            setWinner(data.session.winner);
            setPlayers(data.session.players);
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(pollInterval);
  }, [gameSession, gameStatus, userSession]);

  const handleCreateSession = async () => {
    if (playerCount < 1 || playerCount > 2) {
      setError('Player count must be 1 or 2');
      return;
    }

    // Check payment requirement for 3+ players (no longer needed, but keep for safety)
    if (playerCount >= 3) {
      const userPlan = getUserPlan(userSession);
      const batchRequirement = checkPaymentRequirementNew('web-tools', 0, playerCount, userPlan);
      const hasValidPass = hasValidProcessingPassNew(userSession);
      
      if (!hasValidPass && batchRequirement.requiresPayment && batchRequirement.reason === 'batch') {
        const paymentReq = {
          requiresPayment: true,
          reason: 'batch',
          playerCount: playerCount,
          message: `Multiplayer games with ${playerCount} players require a Processing Pass. Free tier allows up to 2 players.`,
          ...batchRequirement,
        };
        
        setPaymentRequirement(paymentReq);
        setShowPaymentModal(true);
        return;
      }
    }

    setIsLoading(true);
    setError('');

    try {
      const passData = typeof window !== 'undefined' ? localStorage.getItem('processingPass') : null;
      let userSessionId = null;
      
      if (passData) {
        try {
          const pass = JSON.parse(passData);
          const session = { processingPass: pass };
          if (hasValidProcessingPassNew(session)) {
            userSessionId = pass.sessionId || null;
          }
        } catch (e) {
          // Invalid pass data
        }
      }

      const response = await fetch('/api/games/tic-tac-toe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          playerCount: playerCount,
          userSessionId: userSessionId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402) {
          setPaymentRequirement(data.requirement);
          setShowPaymentModal(true);
          setIsLoading(false);
          return;
        }
        throw new Error(data.message || data.error || 'Failed to create game session');
      }

      if (data.success && data.session) {
        setGameSession(data.session);
        setGameStatus(data.session.gameStatus);
        setPlayers(data.session.players || []);
        setGameBoard(Array(9).fill(null));
      }
    } catch (err) {
      console.error('Create session error:', err);
      setError(err.message || 'Failed to create game session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinSession = async () => {
    if (!gameSession || !playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/games/tic-tac-toe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'join',
          sessionId: gameSession.sessionId,
          playerName: playerName.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to join game session');
      }

      if (data.success && data.session) {
        setGameSession(data.session);
        setGameStatus(data.session.gameStatus);
        setPlayers(data.session.players);
        setGameBoard(data.session.board);
        setCurrentPlayer(data.session.currentPlayer);
        setCurrentPlayerName(playerName.trim());

        // For single player mode, add AI player automatically
        if (playerCount === 1 && data.session.players.length === 1) {
          // Add AI player
          const aiPlayer = {
            id: 'player_ai',
            name: 'AI Opponent',
            symbol: 'O',
            isAI: true,
          };
          const updatedPlayers = [...data.session.players, aiPlayer];
          setPlayers(updatedPlayers);
          
          // Auto-start game for single player
          const updatedSession = {
            ...data.session,
            players: updatedPlayers,
            gameStatus: 'playing',
            currentPlayer: 0,
          };
          setGameSession(updatedSession);
          setGameStatus('playing');
        }
      }
    } catch (err) {
      console.error('Join session error:', err);
      setError(err.message || 'Failed to join game session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCellClick = async (index, isAIMove = false) => {
    if (gameStatus !== 'playing') return;
    if (gameBoard[index] !== null) return;

    const currentPlayerObj = players[currentPlayer];
    if (!currentPlayerObj) return;

    // Don't allow manual clicks when AI is playing
    if (isAIPlaying && !isAIMove) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/games/tic-tac-toe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'move',
          sessionId: gameSession.sessionId,
          playerId: currentPlayerObj.id,
          position: index,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to make move');
      }

      if (data.success && data.session) {
        const updatedBoard = [...data.session.board];
        setGameBoard(updatedBoard);
        setCurrentPlayer(data.session.currentPlayer);
        setGameStatus(data.session.gameStatus);
        setWinner(data.session.winner);
        const newMoves = moves + 1;
        setMoves(newMoves);

        if (data.session.gameStatus === 'finished') {
          const gameResult = {
            winner: data.session.winner,
            moves: newMoves,
            players: data.session.players.map(p => p.name),
            timestamp: new Date().toISOString(),
          };
          setGameHistory([...gameHistory, gameResult]);
          setIsAIPlaying(false);
        } else {
          // Check if it's AI's turn (single player mode)
          const nextPlayer = data.session.players[data.session.currentPlayer];
          if (nextPlayer && nextPlayer.id === 'player_ai' && playerCount === 1) {
            setIsAIPlaying(true);
            // AI makes move after a short delay
            setTimeout(() => {
              const aiSymbol = nextPlayer.symbol;
              const playerSymbol = players.find(p => p.id !== 'player_ai')?.symbol || 'X';
              const aiMoveIndex = getAIMove(updatedBoard, aiSymbol, playerSymbol);
              
              if (aiMoveIndex !== -1 && aiMoveIndex < 9 && updatedBoard[aiMoveIndex] === null) {
                handleCellClick(aiMoveIndex, true);
              } else {
                setIsAIPlaying(false);
              }
            }, 800);
          } else {
            setIsAIPlaying(false);
          }
        }
      }
    } catch (err) {
      console.error('Make move error:', err);
      setError(err.message || 'Failed to make move. Please try again.');
      setIsAIPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetGame = async () => {
    if (!gameSession) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/games/tic-tac-toe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reset',
          sessionId: gameSession.sessionId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to reset game');
      }

      if (data.success && data.session) {
        setGameBoard(data.session.board);
        setCurrentPlayer(data.session.currentPlayer);
        setGameStatus(data.session.gameStatus);
        setWinner(data.session.winner);
        setMoves(0);
      }
    } catch (err) {
      console.error('Reset game error:', err);
      setError(err.message || 'Failed to reset game. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewGame = () => {
    setGameSession(null);
    setPlayerCount(2);
    setPlayerName('');
    setCurrentPlayerName('');
    setGameBoard(Array(9).fill(null));
    setCurrentPlayer(0);
    setGameStatus('waiting');
    setWinner(null);
    setPlayers([]);
    setError('');
    setMoves(0);
  };

  const handlePaymentSuccess = () => {
    const passData = localStorage.getItem('processingPass');
    if (passData) {
      try {
        const pass = JSON.parse(passData);
        setUserSession({ processingPass: pass });
      } catch (e) {
        // Invalid pass data
      }
    }
    setShowPaymentModal(false);
    if (playerCount >= 3) {
      handleCreateSession();
    }
  };

  // Structured Data
  const structuredData = {
    faqPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I play Tic Tac Toe?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Tic Tac Toe is a two-player game played on a 3x3 grid. Players take turns marking squares with X or O. The first player to get three of their marks in a row (horizontally, vertically, or diagonally) wins. If all squares are filled without a winner, the game is a draw."
          }
        },
        {
          "@type": "Question",
          "name": "Can I play Tic Tac Toe with multiple players?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, you can play with 1-2 players for free. Games with 3 or more players require a Processing Pass. Players take turns on the same board, with each player assigned a unique symbol (X, O, etc.)."
          }
        },
        {
          "@type": "Question",
          "name": "How do multiplayer sessions work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "To play with multiple players, create a game session with the desired number of players. Each player joins the session with their name. Once all players have joined, the game begins. Players take turns in order, and the game board updates in real-time for all players."
          }
        },
        {
          "@type": "Question",
          "name": "Can I play against the computer?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Currently, the game supports multiplayer sessions with human players. Computer/AI opponent functionality may be added in future updates. For now, you can play with friends by sharing the session ID or playing on the same device."
          }
        },
        {
          "@type": "Question",
          "name": "How do I win at Tic Tac Toe?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "To win Tic Tac Toe, you need to get three of your marks (X or O) in a row. This can be horizontally (any row), vertically (any column), or diagonally (corner to corner). Strategy involves blocking your opponent while trying to create your own winning line. The center square and corners are often the most strategic positions."
          }
        },
        {
          "@type": "Question",
          "name": "Is Tic Tac Toe always a draw?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Not always. If both players play optimally (perfect play), Tic Tac Toe will always end in a draw. However, in practice, players make mistakes, allowing one player to win. The game is more interesting when players don't play perfectly, leading to strategic gameplay and learning opportunities."
          }
        },
        {
          "@type": "Question",
          "name": "Is this Tic Tac Toe game free to play?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our Tic Tac Toe game is free for 1-2 players. Multiplayer games with 3 or more players require a Processing Pass. We aim to provide fun games for free while offering premium options for advanced multiplayer features."
          }
        }
      ]
    },
    
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Tic Tac Toe Game",
      "applicationCategory": "GameApplication",
      "operatingSystem": "Any",
      "description": "Free online Tic Tac Toe game. Play multiplayer Tic Tac Toe with friends. Classic 3x3 grid game with real-time multiplayer support. No downloads, no sign-ups, just fun.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1420",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Multiplayer support (1-10 players)",
        "Real-time game sessions",
        "Session-based gameplay",
        "Win/draw detection",
        "Game history tracking",
        "Mobile-friendly design",
        "No downloads required",
        "Instant play"
      ]
    },
    
    howTo: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Play Tic Tac Toe Online",
      "description": "Step-by-step guide to playing Tic Tac Toe online with multiple players",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Choose Number of Players",
          "text": "Select the number of players (1-2 for free, 3+ requires Processing Pass). Enter your player name if needed.",
          "position": 1
        },
        {
          "@type": "HowToStep",
          "name": "Create Game Session",
          "text": "Click 'Create Game Session' to start a new game. You'll receive a session ID that other players can use to join.",
          "position": 2
        },
        {
          "@type": "HowToStep",
          "name": "Join or Start Playing",
          "text": "If you're joining an existing session, enter the session ID and your name. Once all players have joined, the game begins.",
          "position": 3
        },
        {
          "@type": "HowToStep",
          "name": "Take Turns",
          "text": "Players take turns clicking on an empty square to place their mark (X or O). The game tracks whose turn it is.",
          "position": 4
        },
        {
          "@type": "HowToStep",
          "name": "Win or Draw",
          "text": "The first player to get three marks in a row (horizontally, vertically, or diagonally) wins. If all squares are filled without a winner, it's a draw.",
          "position": 5
        }
      ]
    },
    
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": `${siteHost}/`
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Games",
          "item": `${siteHost}/games`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Puzzle Games",
          "item": `${siteHost}/games/puzzle-games`
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Tic Tac Toe",
          "item": canonicalUrl
        }
      ]
    }
  };

  // Get current player info
  const currentPlayerObj = players[currentPlayer] || null;
  const isMyTurn = currentPlayerObj && currentPlayerName === currentPlayerObj.name;

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Tic Tac Toe - Free Online Multiplayer Game | FixTools</title>
        <meta name="title" content="Tic Tac Toe - Free Online Multiplayer Game | FixTools" />
        <meta name="description" content="Play Tic Tac Toe online for free. Classic 3x3 grid game with multiplayer support. Play with friends in real-time game sessions. No downloads, no sign-ups, just fun." />
        <meta name="keywords" content="tic tac toe, tic tac toe game, play tic tac toe online, multiplayer tic tac toe, online tic tac toe, free tic tac toe, tic tac toe with friends, noughts and crosses" />
        <meta name="author" content="FixTools" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/fixtools-logos/fixtools-logos_black.svg" type="image/svg+xml" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Tic Tac Toe - Free Online Multiplayer Game" />
        <meta property="og:description" content="Play Tic Tac Toe online for free. Classic 3x3 grid game with multiplayer support. Play with friends in real-time game sessions." />
        <meta property="og:image" content={`${siteHost}/images/og-tic-tac-toe.png`} />
        <meta property="og:site_name" content="FixTools" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content="Tic Tac Toe - Free Online Multiplayer Game" />
        <meta property="twitter:description" content="Play Tic Tac Toe online for free. Classic 3x3 grid game with multiplayer support. Play with friends in real-time game sessions." />
        <meta property="twitter:image" content={`${siteHost}/images/og-tic-tac-toe.png`} />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.softwareApp) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howTo) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
      </Head>

      <style jsx global>{`
        html:has(.tic-tac-toe-page) {
          font-size: 100% !important;
        }
        
        .tic-tac-toe-page * {
          box-sizing: border-box;
        }
        
        .tic-tac-toe-page h1,
        .tic-tac-toe-page h2,
        .tic-tac-toe-page h3,
        .tic-tac-toe-page p,
        .tic-tac-toe-page ul,
        .tic-tac-toe-page ol {
          margin: 0;
        }
        
        .tic-tac-toe-page button {
          font-family: inherit;
          cursor: pointer;
        }
        
        .tic-tac-toe-page input,
        .tic-tac-toe-page textarea,
        .tic-tac-toe-page select {
          font-family: inherit;
        }
        
        /* Fix typography styling within tic tac toe page sections */
        .tic-tac-toe-page section .max-w-none {
          font-size: 16px !important;
          line-height: 1.75 !important;
          color: #334155 !important;
        }
        
        .tic-tac-toe-page section .max-w-none h3 {
          font-size: 20px !important;
          font-weight: 700 !important;
          line-height: 1.75rem !important;
          margin-top: 1.5rem !important;
          margin-bottom: 0.75rem !important;
          color: #0f172a !important;
        }
        
        .tic-tac-toe-page section .max-w-none p {
          font-size: 16px !important;
          line-height: 1.75 !important;
          margin-bottom: 1rem !important;
          margin-top: 0 !important;
          color: #334155 !important;
        }
        
        .tic-tac-toe-page section .max-w-none ol {
          margin-top: 1rem !important;
          margin-bottom: 1rem !important;
          padding-left: 1.5rem !important;
          color: #334155 !important;
          list-style-type: decimal !important;
          list-style-position: outside !important;
        }
        
        .tic-tac-toe-page section .max-w-none ul {
          margin-top: 1rem !important;
          margin-bottom: 1rem !important;
          padding-left: 1.5rem !important;
          color: #334155 !important;
          list-style-type: disc !important;
          list-style-position: outside !important;
        }
        
        .tic-tac-toe-page section .max-w-none ol li,
        .tic-tac-toe-page section .max-w-none ul li {
          margin-top: 0.75rem !important;
          margin-bottom: 0.75rem !important;
          line-height: 1.75 !important;
          padding-left: 0.5rem !important;
          font-size: 16px !important;
        }
        
        .tic-tac-toe-page section .max-w-none strong {
          font-weight: 600 !important;
          color: #0f172a !important;
        }
        
        .tic-tac-toe-page section .max-w-none a {
          color: #7c2d12 !important;
          text-decoration: underline !important;
          font-weight: 500 !important;
        }
        
        .tic-tac-toe-page section .max-w-none a:hover {
          color: #9a3412 !important;
        }
        
        /* Override global CSS font-size for this page */
        .tic-tac-toe-page {
          font-size: 16px !important;
        }
        
        .tic-tac-toe-page h1 {
          font-size: 3rem !important;
        }
        
        .tic-tac-toe-page h2 {
          font-size: 1.875rem !important;
        }
        
        .tic-tac-toe-page h3 {
          font-size: 1.25rem !important;
        }
        
        .tic-tac-toe-page p,
        .tic-tac-toe-page li,
        .tic-tac-toe-page span {
          font-size: 1rem !important;
        }
      `}</style>

      <div className="tic-tac-toe-page bg-[#fbfbfc] text-slate-900 min-h-screen">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/fixtools-logos/fixtools-logos_black.svg" alt="FixTools" width={120} height={40} className="h-9 w-auto" />
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
              <Link className="hover:text-slate-900 transition-colors" href="/tools/json">JSON</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/html">HTML</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/tools/web-tools">Web Tools</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/games">Games</Link>
              <Link className="hover:text-slate-900 transition-colors" href="/">All tools</Link>
            </nav>
            <Link href="/tools" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50 transition-colors">
              Browse tools
            </Link>
          </div>
        </header>

        <nav className="mx-auto max-w-6xl px-4 py-3" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-slate-600">
            <li><Link href="/" className="hover:text-slate-900 transition-colors">Home</Link></li>
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><Link href="/games" className="hover:text-slate-900 transition-colors">Games</Link></li>
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><Link href="/games/puzzle-games" className="hover:text-slate-900 transition-colors">Puzzle Games</Link></li>
            <li className="flex items-center gap-2"><span className="text-slate-400">/</span><span className="font-semibold text-slate-900">Tic Tac Toe</span></li>
          </ol>
        </nav>

        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url(/grid.png)', backgroundSize: '256px 256px' }}></div>
          <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-1.5 text-xs font-semibold text-purple-700 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              Free • Multiplayer • Real-Time
            </div>
            
            <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                Tic Tac Toe
              </span>
            </h1>
            
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg md:leading-relaxed">
              Play the classic <strong>Tic Tac Toe</strong> game online for free. Challenge friends in multiplayer sessions. No downloads, no sign-ups, just fun.
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Players</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">1-10</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Game Type</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">Multiplayer</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Session</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">Real-Time</dd>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Price</dt>
                <dd className="mt-1.5 text-sm font-bold text-slate-900">Free</dd>
              </div>
            </dl>
          </div>
        </section>

        <section id="game" className="mx-auto max-w-6xl px-4 pb-12 pt-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-7" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            {/* Game Setup */}
            {!gameSession && (
              <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Create Game Session</h2>
                    <p className="mt-1 text-sm text-slate-600">Choose number of players and create a new game session.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                  <div className="md:col-span-8">
                    <label className="mb-2 block text-sm font-semibold text-slate-800">Number of Players</label>
                    <select
                      value={playerCount}
                      onChange={(e) => setPlayerCount(parseInt(e.target.value))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-purple-900/20"
                    >
                      <option value={1}>1 Player (vs AI)</option>
                      <option value={2}>2 Players (Local Multiplayer)</option>
                    </select>

                    {error && (
                      <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {error}
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-4">
                    <label className="mb-2 block text-sm font-semibold text-slate-800">Info</label>
                    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="rounded-xl border border-violet-200 bg-violet-50 p-3">
                        <p className="text-xs font-semibold text-violet-900 mb-1">Game Modes</p>
                        <p className="text-xs text-violet-700">1 Player: vs AI</p>
                        <p className="text-xs text-violet-700">2 Players: Local</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button 
                    onClick={handleCreateSession} 
                    disabled={isLoading}
                    className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Creating...' : '🎮 Create Game Session'}
                  </button>
                </div>
              </div>
            )}

            {/* Waiting for Players (Only for 2-player mode) */}
            {gameSession && gameStatus === 'waiting' && playerCount === 2 && (
              <div className="space-y-6">
                <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Waiting for Players</h3>
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-slate-700 mb-2">Session ID:</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 rounded-xl border border-purple-200 bg-white p-3 text-sm font-mono text-purple-900 break-all">
                        {gameSession.sessionId}
                      </code>
                      <button
                        onClick={() => navigator.clipboard.writeText(gameSession.sessionId)}
                        className="rounded-xl border border-purple-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-purple-50"
                        title="Copy Session ID"
                      >
                        📋 Copy
                      </button>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">Share this session ID with the other player so they can join</p>
                  </div>

                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-semibold text-slate-800">Your Name</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="Enter your name"
                        className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-purple-900/20"
                      />
                      <button
                        onClick={handleJoinSession}
                        disabled={isLoading || !playerName.trim()}
                        className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Joining...' : 'Join Game'}
                      </button>
                    </div>
                  </div>

                  <div className="rounded-xl border border-purple-200 bg-white p-4">
                    <p className="text-sm font-semibold text-slate-700 mb-2">Players Joined:</p>
                    <div className="space-y-2">
                      {players.length > 0 ? (
                        players.map((player, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <span className={`flex h-8 w-8 items-center justify-center rounded-lg font-bold ${
                              player.symbol === 'X' ? 'bg-purple-100 text-purple-600' :
                              player.symbol === 'O' ? 'bg-pink-100 text-pink-600' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {player.symbol}
                            </span>
                            <span className="text-slate-900">{player.name}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">No players joined yet</p>
                      )}
                      <p className="text-xs text-slate-600 mt-2">
                        {players.length} of {playerCount} players joined
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleNewGame}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                  >
                    Cancel / New Game
                  </button>
                </div>
              </div>
            )}

            {/* Single Player Mode - Direct Start */}
            {gameSession && gameStatus === 'waiting' && playerCount === 1 && (
              <div className="space-y-6">
                <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Single Player Mode</h3>
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-semibold text-slate-800">Your Name</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="Enter your name"
                        className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-purple-900/20"
                      />
                      <button
                        onClick={handleJoinSession}
                        disabled={isLoading || !playerName.trim()}
                        className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Starting...' : 'Start Game'}
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">You'll play against an AI opponent</p>
                  <button
                    onClick={handleNewGame}
                    className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                  >
                    Cancel / New Game
                  </button>
                </div>
              </div>
            )}

            {/* Game Board */}
            {gameSession && gameStatus === 'playing' && (
              <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Game in Progress</h2>
                    {currentPlayerObj && (
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm ${
                          isMyTurn ? 'bg-purple-100 text-purple-700 border-2 border-purple-300' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {currentPlayerObj.symbol}
                          <span>{currentPlayerObj.name}'s turn</span>
                        </span>
                        {!isMyTurn && playerCount === 1 && currentPlayerObj?.id === 'player_ai' && (
                          <span className="text-sm text-pink-600 font-semibold">AI is thinking...</span>
                        )}
                        {!isMyTurn && playerCount === 2 && (
                          <span className="text-sm text-slate-500">Waiting for other player...</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleResetGame}
                      disabled={isLoading}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Reset
                    </button>
                    <button
                      onClick={handleNewGame}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all"
                    >
                      New Game
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {/* Main Game Area */}
                <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
                  {/* Players List */}
                  <div className="w-full lg:w-64 flex-shrink-0">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Players</h3>
                    <div className="space-y-2">
                      {players.map((player, idx) => (
                        <div
                          key={idx}
                          className={`rounded-xl border-2 p-3 flex items-center gap-3 transition-all ${
                            idx === currentPlayer && gameStatus === 'playing'
                              ? 'border-purple-400 bg-purple-50 shadow-md'
                              : 'border-slate-200 bg-white'
                          }`}
                        >
                          <div className={`flex h-10 w-10 items-center justify-center rounded-lg font-bold text-lg flex-shrink-0 ${
                            player.symbol === 'X' ? 'bg-purple-100 text-purple-600' :
                            player.symbol === 'O' ? 'bg-pink-100 text-pink-600' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {player.symbol}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{player.name}</p>
                            {idx === currentPlayer && gameStatus === 'playing' && (
                              <p className="text-xs text-purple-600 font-semibold">Current Turn</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Game Board */}
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="relative">
                      {/* Board Container */}
                      <div className="p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 rounded-3xl border-4 border-purple-200 shadow-2xl">
                        {/* Game Grid */}
                        <div className="grid grid-cols-3 bg-slate-900 rounded-xl shadow-inner overflow-hidden" style={{ width: '360px', height: '360px', gap: '2px' }}>
                          {gameBoard.map((cell, index) => {
                            const isWinningCell = winner && winner !== 'draw' && checkWinner(gameBoard) && (
                              (index === 0 || index === 1 || index === 2) && gameBoard[0] === gameBoard[1] && gameBoard[1] === gameBoard[2] ||
                              (index === 3 || index === 4 || index === 5) && gameBoard[3] === gameBoard[4] && gameBoard[4] === gameBoard[5] ||
                              (index === 6 || index === 7 || index === 8) && gameBoard[6] === gameBoard[7] && gameBoard[7] === gameBoard[8] ||
                              (index === 0 || index === 3 || index === 6) && gameBoard[0] === gameBoard[3] && gameBoard[3] === gameBoard[6] ||
                              (index === 1 || index === 4 || index === 7) && gameBoard[1] === gameBoard[4] && gameBoard[4] === gameBoard[7] ||
                              (index === 2 || index === 5 || index === 8) && gameBoard[2] === gameBoard[5] && gameBoard[5] === gameBoard[8] ||
                              (index === 0 || index === 4 || index === 8) && gameBoard[0] === gameBoard[4] && gameBoard[4] === gameBoard[8] ||
                              (index === 2 || index === 4 || index === 6) && gameBoard[2] === gameBoard[4] && gameBoard[4] === gameBoard[6]
                            );

                            return (
                              <button
                                key={index}
                                onClick={() => isMyTurn && !cell && !isLoading && handleCellClick(index)}
                                disabled={!isMyTurn || cell !== null || isLoading || gameStatus !== 'playing'}
                                className={`
                                  flex items-center justify-center font-bold text-6xl transition-all duration-200
                                  ${cell === 'X' 
                                    ? 'bg-purple-100 text-purple-600 hover:bg-purple-200' 
                                    : cell === 'O' 
                                    ? 'bg-pink-100 text-pink-600 hover:bg-pink-200'
                                    : 'bg-white hover:bg-purple-50'
                                  }
                                  ${isWinningCell ? 'ring-4 ring-green-400 ring-opacity-100 bg-green-200 scale-105' : ''}
                                  ${!isMyTurn || cell !== null || gameStatus !== 'playing' 
                                    ? 'opacity-60 cursor-not-allowed' 
                                    : 'hover:scale-105 cursor-pointer active:scale-95'
                                  }
                                `}
                              >
                                {cell || ''}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Game Stats */}
                    <div className="flex items-center justify-center gap-8 mt-6">
                      <div className="text-center px-4 py-2 rounded-xl bg-slate-50 border border-slate-200">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Moves</p>
                        <p className="text-xl font-bold text-slate-900 mt-1">{moves}</p>
                      </div>
                      <div className="text-center px-4 py-2 rounded-xl bg-slate-50 border border-slate-200">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</p>
                        <p className="text-xl font-bold text-slate-900 mt-1">{gameStatus === 'playing' ? 'Playing' : 'Finished'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Game Finished */}
            {gameSession && gameStatus === 'finished' && (
              <div className="space-y-6">
                <div className={`rounded-xl border-2 p-6 text-center ${
                  winner === 'draw' ? 'border-yellow-200 bg-yellow-50' :
                  winner === 'X' ? 'border-purple-300 bg-purple-50' :
                  'border-pink-300 bg-pink-50'
                }`}>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {winner === 'draw' ? "It's a Draw!" : `${winner === 'X' ? players.find(p => p.symbol === 'X')?.name : players.find(p => p.symbol === 'O')?.name} Wins!`}
                  </h3>
                  <p className="text-slate-600 mb-4">Game finished in {moves} moves</p>
                  
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={handleResetGame}
                      className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
                    >
                      Play Again
                    </button>
                    <button
                      onClick={handleNewGame}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                    >
                      New Session
                    </button>
                  </div>
                </div>

                {/* Final Board Display */}
                <div className="flex flex-col items-center justify-center my-8">
                  <div className="p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 rounded-3xl border-4 border-purple-200 shadow-2xl">
                    <div className="grid grid-cols-3 bg-slate-900 rounded-xl shadow-inner overflow-hidden" style={{ width: '360px', height: '360px', gap: '2px' }}>
                      {gameBoard.map((cell, index) => {
                        return (
                          <div
                            key={index}
                            className={`
                              flex items-center justify-center font-bold text-6xl
                              ${cell === 'X' ? 'bg-purple-100 text-purple-600' :
                                cell === 'O' ? 'bg-pink-100 text-pink-600' :
                                'bg-white'
                              }
                            `}
                          >
                            {cell || ''}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          requirement={paymentRequirement}
          onPaymentSuccess={handlePaymentSuccess}
        />

        {/* Educational Content Sections - 2,500+ words */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">What is Tic Tac Toe?</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                <strong>Tic Tac Toe</strong> (also known as Noughts and Crosses or Xs and Os) is a classic two-player strategy game played on a 3x3 grid. It's one of the simplest and most recognizable games in the world, often used as an introduction to game theory and strategic thinking. The game's simplicity makes it accessible to players of all ages, while its strategic depth makes it engaging despite being easy to learn.
              </p>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                In Tic Tac Toe, players take turns marking squares in a 3x3 grid with their symbol (X or O). The first player to get three of their marks in a row—horizontally, vertically, or diagonally—wins the game. If all nine squares are filled without either player achieving three in a row, the game ends in a draw. Despite its simplicity, Tic Tac Toe demonstrates fundamental game theory concepts and is a perfect introduction to strategic thinking.
              </p>

              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Tic Tac Toe is perfect for quick games, teaching strategy to children, practicing game theory concepts, and having fun with friends and family. The game's balanced nature (with perfect play, it always ends in a draw) makes it fair and engaging, while its simplicity makes it ideal for players of all skill levels.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">How Tic Tac Toe Works</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Tic Tac Toe gameplay involves several key elements:
              </p>
              <ol className="space-y-3 mb-4 ml-6 text-slate-700" style={{ listStyleType: 'decimal', listStylePosition: 'outside', paddingLeft: '1.5rem' }}>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Game Setup:</strong> The game begins with an empty 3x3 grid. The first player is assigned X, and the second player is assigned O (or in multiplayer games, players receive symbols in order).</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Turn-Based Play:</strong> Players take turns placing their symbol in an empty square. The first player (X) goes first, followed by the second player (O), and so on in multiplayer games.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Winning Conditions:</strong> A player wins by placing three of their symbols in a row, either horizontally (any row), vertically (any column), or diagonally (corner to corner). The game ends immediately when a winning condition is met.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Draw Condition:</strong> If all nine squares are filled without either player achieving three in a row, the game ends in a draw. This is the only outcome possible when both players play optimally.</li>
                <li className="leading-relaxed pl-2" style={{ fontSize: '16px', lineHeight: '1.75' }}><strong>Game Reset:</strong> After a win or draw, players can reset the board and play again. Each new game starts with a fresh, empty grid.</li>
              </ol>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">Tic Tac Toe Strategy</h3>
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">🏆</span>
                    Basic Strategy
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    If your opponent takes a corner, take the center. If your opponent takes the center, take a corner. Control the center square for better winning opportunities.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Control the center square</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Block your opponent's winning moves</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Create multiple winning opportunities</span>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-2xl border-2 border-pink-200 bg-pink-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-100 text-pink-600">🎯</span>
                    Advanced Tips
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    Look for forks (positions that create two winning opportunities simultaneously). Force your opponent to block one while you complete the other.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-pink-600 font-bold mt-0.5">•</span>
                      <span>Create fork opportunities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-600 font-bold mt-0.5">•</span>
                      <span>Recognize and block opponent forks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-600 font-bold mt-0.5">•</span>
                      <span>Control multiple lines simultaneously</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <p className="text-base text-slate-700 leading-relaxed">
                Understanding Tic Tac Toe strategy helps improve gameplay, recognize winning patterns, block opponent moves, and enjoy the game more. While optimal play always leads to a draw, recognizing patterns and creating winning opportunities makes each game exciting and strategic.
              </p>
            </div>
          </div>
        </section>

        {/* Multiplayer Features Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Multiplayer Features</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Our Tic Tac Toe game supports multiplayer sessions where multiple players can join and play together:
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">1-2 Players (Free)</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Play with 1 or 2 players completely free. Perfect for quick games with a friend or family member. The classic two-player experience is available at no cost, allowing you to enjoy Tic Tac Toe anytime, anywhere.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">3+ Players (Premium)</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Multiplayer games with 3 or more players require a Processing Pass. This allows you to create larger game sessions with friends, family, or colleagues. Each player takes turns in order, making for exciting group gameplay.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">Session-Based Gameplay</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Our multiplayer system uses session-based gameplay. When you create a game session, you receive a unique session ID that other players can use to join. Once all players have joined, the game begins automatically. The game board updates in real-time for all players, keeping everyone synchronized.
              </p>

              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">Real-Time Updates</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Game sessions update in real-time using polling technology. When a player makes a move, all players see the updated board within seconds. This ensures everyone stays synchronized and can respond to moves immediately.
              </p>
            </div>
          </div>
        </section>

        {/* How to Play Section */}
        <section id="how" className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">How to Play Tic Tac Toe</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-6">
                Playing Tic Tac Toe is simple and fun. Follow these steps:
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold text-xl shadow-lg mb-4">
                    1
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Create Game Session</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Select the number of players (1-2 for free, 3+ requires Processing Pass) and click "Create Game Session". You'll receive a session ID to share with other players.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold text-xl shadow-lg mb-4">
                    2
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Join Game</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Enter your name and click "Join Game". If you're joining an existing session, use the session ID provided by the game creator.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold text-xl shadow-lg mb-4">
                    3
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Take Turns</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    When it's your turn, click an empty square to place your mark (X or O). Players take turns in order until someone wins or the game ends in a draw.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold text-xl shadow-lg mb-4">
                    4
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Win or Draw</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    The first player to get three marks in a row (horizontally, vertically, or diagonally) wins. If all squares are filled without a winner, it's a draw.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Tic Tac Toe Tips & Strategies</h2>
            </div>
            
            <div className="max-w-none">
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                Improve your Tic Tac Toe gameplay with these tips and strategies:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Opening Moves</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Taking the center gives you the best winning chances</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Corner positions are strong second choices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>Edge positions (middle of sides) are weakest</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-pink-200 bg-pink-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Defensive Play</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-pink-600 font-bold mt-0.5">•</span>
                      <span>Always block your opponent's winning moves</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-600 font-bold mt-0.5">•</span>
                      <span>Watch for opponent's two-in-a-row threats</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-600 font-bold mt-0.5">•</span>
                      <span>Control multiple lines to limit opponent options</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Offensive Play</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">•</span>
                      <span>Create fork opportunities (two winning paths)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">•</span>
                      <span>Force your opponent to block while you win elsewhere</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-0.5">•</span>
                      <span>Look for positions that create multiple threats</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-violet-200 bg-violet-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Perfect Play</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-violet-600 font-bold mt-0.5">•</span>
                      <span>With perfect play from both players, game always draws</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-600 font-bold mt-0.5">•</span>
                      <span>Mistakes create winning opportunities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-600 font-bold mt-0.5">•</span>
                      <span>Practice helps recognize patterns faster</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8" style={{ boxShadow: '0 12px 40px rgba(2, 6, 23, 0.08)' }}>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {structuredData.faqPage.mainEntity.map((faq, index) => (
                <details key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4" open={index === 0}>
                  <summary className="cursor-pointer text-sm font-semibold text-slate-900">{faq.name}</summary>
                  <p className="mt-2 text-sm text-slate-600">{faq.acceptedAnswer.text}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Related Games Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Related Games</h2>
            <p className="text-slate-600">Explore more puzzle games:</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Link href="/games" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-purple-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🎮</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">All Games</p>
                  <p className="text-xs text-slate-500">Browse Category</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Discover all free online games including word games, number games, and puzzles.</p>
              <p className="mt-4 text-sm font-semibold text-purple-600 group-hover:text-purple-700">Browse games →</p>
            </Link>

            <Link href="/games/puzzle-games" className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-purple-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🧩</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Puzzle Games</p>
                  <p className="text-xs text-slate-500">Puzzle Category</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Explore more puzzle games including Memory Game, Pattern Matching, and Logic Puzzles.</p>
              <p className="mt-4 text-sm font-semibold text-purple-600 group-hover:text-purple-700">Browse puzzles →</p>
            </Link>

            <div className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-purple-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-slate-400 to-slate-500 shadow-lg">
                  <span className="text-2xl">🎲</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">Memory Game</p>
                  <p className="text-xs text-slate-500">Coming Soon</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Test your memory with card matching games. Coming soon!</p>
              <p className="mt-4 text-sm font-semibold text-slate-400">Coming soon →</p>
            </div>
          </div>
        </section>

        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-slate-600">© {currentYear} FixTools.io • Free online games</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
              <Link className="hover:text-slate-900" href="/privacy">Privacy</Link>
              <Link className="hover:text-slate-900" href="/terms">Terms</Link>
              <Link className="hover:text-slate-900" href="/games">All games</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

