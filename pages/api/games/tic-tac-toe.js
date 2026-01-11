/**
 * Tic Tac Toe Game API
 * POST /api/games/tic-tac-toe
 * 
 * Manages Tic Tac Toe game sessions for multiplayer games.
 * 1-2 players: Free
 * 3+ players: Requires Processing Pass
 */

import { checkPaymentRequirement } from '../../../lib/config/pricing';
import { verifyProcessingPass } from '../../../lib/payments/payment-utils';

// In-memory game sessions (in production, use Redis or database)
const gameSessions = new Map();

// Get user plan from session
async function getUserPlanFromSession(sessionId) {
  if (!sessionId) return 'free';
  
  try {
    const hasValidPass = await verifyProcessingPass(sessionId);
    if (hasValidPass) {
      return 'day_pass';
    }
  } catch (e) {
    // Invalid session
  }
  return 'free';
}

// Generate unique session ID
function generateSessionId() {
  return `ttt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Initialize new game session
function createGameSession(playerCount) {
  const sessionId = generateSessionId();
  const session = {
    sessionId,
    playerCount,
    players: [],
    board: Array(9).fill(null),
    currentPlayer: 0,
    gameStatus: 'waiting', // waiting, playing, finished
    winner: null,
    moves: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  gameSessions.set(sessionId, session);
  
  // Clean up old sessions (older than 24 hours)
  cleanupOldSessions();
  
  return session;
}

// Get game session
function getGameSession(sessionId) {
  return gameSessions.get(sessionId);
}

// Update game session
function updateGameSession(sessionId, updates) {
  const session = gameSessions.get(sessionId);
  if (!session) return null;
  
  const updatedSession = {
    ...session,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  gameSessions.set(sessionId, updatedSession);
  return updatedSession;
}

// Add player to session
function addPlayerToSession(sessionId, playerName) {
  const session = getGameSession(sessionId);
  if (!session) {
    throw new Error('Session not found');
  }
  
  if (session.players.length >= session.playerCount) {
    throw new Error('Session is full');
  }
  
  if (session.gameStatus !== 'waiting') {
    throw new Error('Game has already started');
  }
  
  const player = {
    id: `player_${session.players.length + 1}`,
    name: playerName || `Player ${session.players.length + 1}`,
    symbol: session.players.length === 0 ? 'X' : 'O',
    joinedAt: new Date().toISOString(),
  };
  
  session.players.push(player);
  
  // Start game if all players joined
  if (session.players.length === session.playerCount) {
    session.gameStatus = 'playing';
    session.currentPlayer = 0;
  }
  
  return updateGameSession(sessionId, session);
}

// Make a move
function makeMove(sessionId, playerId, position) {
  const session = getGameSession(sessionId);
  if (!session) {
    throw new Error('Session not found');
  }
  
  if (session.gameStatus !== 'playing') {
    throw new Error('Game is not in playing state');
  }
  
  if (position < 0 || position > 8) {
    throw new Error('Invalid position');
  }
  
  if (session.board[position] !== null) {
    throw new Error('Position already taken');
  }
  
  const currentPlayer = session.players[session.currentPlayer];
  if (currentPlayer.id !== playerId) {
    throw new Error('Not your turn');
  }
  
  // Make the move
  session.board[position] = currentPlayer.symbol;
  session.moves.push({
    playerId,
    position,
    symbol: currentPlayer.symbol,
    timestamp: new Date().toISOString(),
  });
  
  // Check for winner
  const winner = checkWinner(session.board);
  if (winner) {
    session.gameStatus = 'finished';
    session.winner = winner;
  } else if (session.board.every(cell => cell !== null)) {
    // Draw
    session.gameStatus = 'finished';
    session.winner = 'draw';
  } else {
    // Switch to next player
    session.currentPlayer = (session.currentPlayer + 1) % session.players.length;
  }
  
  return updateGameSession(sessionId, session);
}

// Check for winner
function checkWinner(board) {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6], // Diagonals
  ];
  
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // Returns 'X' or 'O'
    }
  }
  
  return null;
}

// Reset game
function resetGame(sessionId) {
  const session = getGameSession(sessionId);
  if (!session) {
    throw new Error('Session not found');
  }
  
  session.board = Array(9).fill(null);
  session.currentPlayer = 0;
  session.gameStatus = 'playing';
  session.winner = null;
  session.moves = [];
  
  return updateGameSession(sessionId, session);
}

// Clean up old sessions
function cleanupOldSessions() {
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours
  
  for (const [sessionId, session] of gameSessions.entries()) {
    const sessionAge = now - new Date(session.createdAt).getTime();
    if (sessionAge > maxAge) {
      gameSessions.delete(sessionId);
    }
  }
}

// Handle API requests
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only POST requests are supported' 
    });
  }

  try {
    const { action, sessionId, playerCount, playerName, playerId, position, sessionId: requestSessionId } = req.body;

    // Validate action
    if (!action || !['create', 'join', 'move', 'reset', 'get'].includes(action)) {
      return res.status(400).json({
        error: 'Invalid action',
        message: 'Action must be one of: create, join, move, reset, get'
      });
    }

    // Get session ID for request
    const actualSessionId = sessionId || requestSessionId;

    // CREATE SESSION
    if (action === 'create') {
      const requestedPlayerCount = playerCount || 2;
      
      if (requestedPlayerCount < 1 || requestedPlayerCount > 2) {
        return res.status(400).json({
          error: 'Invalid player count',
          message: 'Player count must be 1 or 2 (Tic Tac Toe is a 2-player game)'
        });
      }

      const userSessionId = req.body.userSessionId;
      const userPlan = await getUserPlanFromSession(userSessionId);
      
      // Check payment requirement for 3+ players (no longer needed, but keep for safety)
      if (requestedPlayerCount >= 3) {
        const paymentRequirement = checkPaymentRequirement('web-tools', 0, requestedPlayerCount, userPlan);
        if (paymentRequirement.requiresPayment && paymentRequirement.reason === 'batch') {
          const hasValidPass = await verifyProcessingPass(userSessionId);
          if (!hasValidPass) {
            return res.status(402).json({
              error: 'Payment required',
              message: `Multiplayer games with ${requestedPlayerCount} players require a Processing Pass. Free tier allows up to 2 players.`,
              paymentRequired: true,
              reason: 'batch',
              playerCount: requestedPlayerCount,
              requirement: paymentRequirement,
            });
          }
        }
      }

      const session = createGameSession(requestedPlayerCount);
      return res.status(200).json({
        success: true,
        session: {
          sessionId: session.sessionId,
          playerCount: session.playerCount,
          players: session.players,
          gameStatus: session.gameStatus,
        },
        message: 'Game session created successfully',
      });
    }

    // GET SESSION
    if (action === 'get') {
      if (!actualSessionId) {
        return res.status(400).json({
          error: 'Missing session ID',
          message: 'Session ID is required for get action'
        });
      }

      const session = getGameSession(actualSessionId);
      if (!session) {
        return res.status(404).json({
          error: 'Session not found',
          message: 'The requested game session does not exist'
        });
      }

      return res.status(200).json({
        success: true,
        session: {
          sessionId: session.sessionId,
          playerCount: session.playerCount,
          players: session.players,
          board: session.board,
          currentPlayer: session.currentPlayer,
          gameStatus: session.gameStatus,
          winner: session.winner,
          moves: session.moves.length,
        },
      });
    }

    // JOIN SESSION
    if (action === 'join') {
      if (!actualSessionId) {
        return res.status(400).json({
          error: 'Missing session ID',
          message: 'Session ID is required for join action'
        });
      }

      try {
        const session = addPlayerToSession(actualSessionId, playerName);
        return res.status(200).json({
          success: true,
          session: {
            sessionId: session.sessionId,
            playerCount: session.playerCount,
            players: session.players,
            board: session.board,
            currentPlayer: session.currentPlayer,
            gameStatus: session.gameStatus,
            winner: session.winner,
          },
          message: 'Player joined successfully',
        });
      } catch (error) {
        return res.status(400).json({
          error: 'Failed to join session',
          message: error.message
        });
      }
    }

    // MAKE MOVE
    if (action === 'move') {
      if (!actualSessionId || playerId === undefined || position === undefined) {
        return res.status(400).json({
          error: 'Missing parameters',
          message: 'Session ID, player ID, and position are required for move action'
        });
      }

      try {
        const session = makeMove(actualSessionId, playerId, position);
        return res.status(200).json({
          success: true,
          session: {
            sessionId: session.sessionId,
            playerCount: session.playerCount,
            players: session.players,
            board: session.board,
            currentPlayer: session.currentPlayer,
            gameStatus: session.gameStatus,
            winner: session.winner,
          },
          message: 'Move made successfully',
        });
      } catch (error) {
        return res.status(400).json({
          error: 'Failed to make move',
          message: error.message
        });
      }
    }

    // RESET GAME
    if (action === 'reset') {
      if (!actualSessionId) {
        return res.status(400).json({
          error: 'Missing session ID',
          message: 'Session ID is required for reset action'
        });
      }

      try {
        const session = resetGame(actualSessionId);
        return res.status(200).json({
          success: true,
          session: {
            sessionId: session.sessionId,
            playerCount: session.playerCount,
            players: session.players,
            board: session.board,
            currentPlayer: session.currentPlayer,
            gameStatus: session.gameStatus,
            winner: session.winner,
          },
          message: 'Game reset successfully',
        });
      } catch (error) {
        return res.status(400).json({
          error: 'Failed to reset game',
          message: error.message
        });
      }
    }

  } catch (error) {
    console.error('Tic Tac Toe API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message || 'An unexpected error occurred',
      ...(process.env.NODE_ENV === 'development' && { details: error.stack })
    });
  }
}

