import OutputBuiltins
import Data.Array
import System.IO.Unsafe

board_size = (Array (3,3))
type Input = Position

initialBoard :: Board
initialBoard =unsafePerformIO $ printBoardIO $ board (gridSize board_size) Empty

