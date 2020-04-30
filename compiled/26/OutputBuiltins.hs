module OutputBuiltins where
-- Imports section
import Data.Array
import Data.List
import System.IO.Unsafe
import Data.Char
import System.IO

-- Builtin types
data Player = A | B deriving (Show, Eq)
data Grid = Array (Int, Int) deriving Show
type Board = Array (Int, Int) Content
type Position = (Int, Int)
type Row = [Content]
type BoardProperty = Board -> Bool

data Content = ContentCon Player|Empty deriving (Show, Eq)
-- Builtin functions
board :: (Int,Int) -> Content -> Board
board size c = listArray ((1,1),size) (Prelude.repeat c)

inARow :: (Int,Player,Board) -> Bool
inARow (n,p,b) = (any (isInfixOf (n `ofKind` p)) . allRows) b

ofKind :: Int -> Player -> Row
n `ofKind` p = map ContentCon (replicate n p)

row :: Board -> Int -> Row
row b y = [b!(y,x) | x <- [1..maxCol b]]

rows :: Board -> [Row]
rows b = [row b r | r <- [1..maxRow b]]

col :: Board -> Int -> Row
col b x = [b!(y,x) | y <- [1..maxRow b]]

cols :: Board -> [Row]
cols b = [col b c | c <- [1..maxCol b]]

diagsUp :: Board -> (Int,Int) -> Row
diagsUp b (y,x) | y > maxRow b || x > maxCol b = []
                | otherwise = b!(y,x):diagsUp b (y+1,x+1)

diagsDown :: Board -> (Int,Int) -> Row
diagsDown b (y,x) | y < 1 || x < 1 = []
                  | otherwise = b!(y,x):diagsDown b (y-1,x-1)

diags :: Board -> [Row]
diags b = [diagsUp b (1,x) | x <- [1..maxCol b]] ++
          [diagsUp b (y,1) | y <- [2..maxRow b]] ++
          [diagsDown b (maxRow b,x) | x <- [1..maxCol b]] ++
          [diagsDown b (y,1) | y <- [1..maxRow b-1]]

allRows :: Board -> [Row]
allRows b = rows b ++ cols b ++ diags b

size :: Board -> (Int,Int)
size = snd . bounds

maxRow :: Board -> Int
maxRow = fst . size

maxCol :: Board -> Int
maxCol = snd . size

place :: (Player, Board, Position) -> Board
place (p, b, pos) = unsafePerformIO $ place_wrapper (p, b, pos)

place_wrapper :: (Player, Board, Position) -> IO Board
place_wrapper (p, b, pos) = 
   let new_board = (b // [(pos, ContentCon p)]) in do
       putStrLn $ printBoard new_board
       return (new_board)

next :: Player -> Player
next A = B
next B = A

while :: (t -> Bool) -> (t -> t) -> t -> t
while cond exe v = if (cond) v then while cond exe (exe v) else v

getInt :: IO Int
getInt = do
   hFlush stdout
   i <- getLine
   return $ read i

modifyElement :: (Int, Int) -> Content -> Board -> Board
modifyElement (x, y) c b = b // [((x,y), c)]

modifyRow :: Int -> Content -> Board -> Board
modifyRow x c b= modifyRowHelper b (x, 1) (numRows (bounds b)) c

modifyRowHelper :: Board -> (Int, Int) -> Int -> Content -> Board
modifyRowHelper b (x, y) max c = if (y <= max) then modifyElement (x, y) c (modifyRowHelper b (x, y+1) max c) else b

modifyCol :: Int -> Content -> Board -> Board
modifyCol y c b= modifyColHelper b (1, y) (numCols (bounds b)) c

modifyColHelper :: Board -> (Int, Int) -> Int -> Content -> Board
modifyColHelper b (x, y) max c = if (x <= max) then modifyElement (x, y) c (modifyColHelper b (x+1, y) max c) else b

numRows :: ((Int, Int), (Int, Int)) -> Int
numRows ((a, b), (c, d)) = d

numCols :: ((Int, Int), (Int, Int)) -> Int
numCols ((a, b), (c, d)) = c

gridSize :: Grid -> (Int, Int)
gridSize (Array (x, y)) = (x, y)

byRows :: [[Content]] -> Board
byRows rows = listArray ((1,1),size) (concat (reverse rows))
           where size = (length rows,length (head rows))

getBoardContent :: (Board, Position) -> Content
getBoardContent (b,p) = b!p

printBoardIO :: Board -> IO Board
printBoardIO b = (putStrLn $ printBoard b) >> return b

printBoard :: Board -> String
printBoard b = printBoardHelp b (bounds b) (maxLength b (bounds b))

printBoardHelp :: Board -> ((Int, Int), (Int, Int)) -> Int -> String
printBoardHelp board ((a, b), (c, d)) l = spaceString (board!(a, b)) l ++
                                       if (a < c || b < d) then
                                           if(b < d) then
                                           printBoardHelp board ((a, b+1), (c, d)) l
                                           else "\n" ++ printBoardHelp board ((a+1, 1), (c, d)) l
                                       else ""

maxLength :: Board -> ((Int, Int), (Int, Int)) -> Int
maxLength board ((a, b), (c, d)) = max (length (showCell (board!(a,b)))) (if (a < c || b < d) then
                                                       if(b < d) then
                                                       maxLength board ((a, b+1), (c, d))
                                                       else maxLength board ((a+1, 1), (c, d))
                                                       else 0)

spaceString :: Content -> Int -> String
spaceString c l = showCell c ++ extraSpaces (length (showCell c)) (l+1)

showCell :: Content -> String
showCell (ContentCon c) = show c
showCell c = show c

extraSpaces :: Int -> Int -> String
extraSpaces m l = if (m == l) then "" else " " ++ extraSpaces (m+1) l

open :: Board -> [Position]
open g = [p | (p,v) <- assocs g, v==Empty]

isFull :: BoardProperty
isFull = null . open

input :: Int -> (Int,Int)
input _ = unsafePerformIO $ getInts 0

getInts :: Int -> IO (Int,Int)
getInts _ = do
   return (unsafePerformIO getInt,unsafePerformIO getInt)

 -- Prelude 
-- asdfasdf
