# Chess Game
Simple Local Chess Game in JS

Wireframe

![Image of board](https://s3.amazonaws.com/assets.mockflow.com/app/wireframepro/company/C6909a6cb620e4cf48a2d195b85c8d8c6/projects/M68a9a23e4f63c3289487cc64dd624f041588977483649/pages/c0042029f2ac40e6b0b15e1d33b1640e/image/c0042029f2ac40e6b0b15e1d33b1640e.png)

User Story

-Game will start in ready position with white being the first person to go.
-Clicking on a piece will elevate it and highlight it
  -If the piece cannot be moved, a little shake animation + noise will let the user know the piece cannot move.
  -If it can, the locations which it can move to will be highlighted.
-The user then clicks on the destination of the piece.
  -If valid destination, the piece moves, removing any piece it may capture in the process.
  -If invalid, the same shake and noise will let the user know that isn't a valid destination.
-Moves are deemed valid if:
  -The piece is allowed to move in that manner (i.e. rooks move straight cannot jump pieces, knights move *special* and can jump)
  -The result of that move does *not* place the user in check
  -The piece *moves* and doesn't go to the same square on which it started.
-If user is presently in check, the user will be notified upon turn start and invalid moves through a popup or sound.
-Every time a player moves the game will check itself for draw status (Repetitive moves or no valid moves for the current player without being in check) or checkmate (no valid moves for the current player while in check)
