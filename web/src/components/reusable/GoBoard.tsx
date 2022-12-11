import { memo, useMemo, useEffect, useRef, useState } from "react";
import {
  Game,
  Color,
  SVGBoard,
  FieldBoardObject,
  MarkupBoardObject,
  Position,
} from "wgo";

import "./GoBoard.css";
import { useGoBoard, PositionData } from "../../hooks/useGoBoard";

const createPosition = (positionData: PositionData) => {
  const position = new Position(positionData.size);
  position.grid = positionData.grid;
  position.capCount = positionData.capCount;
  position.turn = positionData.turn;
  return position;
};

const createGoBoard = (
  element: HTMLDivElement,
  setColor: (c: "black" | "white") => void,
  setCapCount: (capCount: { black: number; white: number }) => void,
  syncUp: (positions: PositionData[]) => void
) => {
  const game = new Game(6);
  const board = new SVGBoard(element, {
    height: element.clientHeight,
    size: 6,
  });
  let fieldObjects: FieldBoardObject[] = [];
  let markerObject: MarkupBoardObject | null | false = null;
  const updateFieldObjects = () => {
    fieldObjects = fieldObjects.filter((obj) => {
      if (
        game.getStone(obj.x, obj.y) !== (obj.type === "B" ? Color.B : Color.W)
      ) {
        board.removeObject(obj);
        return false;
      }
      return true;
    });
    if (markerObject) {
      board.removeObject(markerObject);
    }
    markerObject = null;
    for (let x = 0; x < game.position.size; x += 1) {
      for (let y = 0; y < game.position.size; y += 1) {
        const c = game.position.get(x, y);
        if (
          c &&
          !fieldObjects.some(
            (obj) =>
              obj.x === x &&
              obj.y === y &&
              c === (obj.type === "B" ? Color.B : Color.W)
          )
        ) {
          const obj = new FieldBoardObject(c === Color.B ? "B" : "W", x, y);
          board.addObject(obj);
          fieldObjects.push(obj);
          if (markerObject === null) {
            markerObject = new MarkupBoardObject("SQ", x, y, c);
            board.addObject(markerObject);
          } else if (markerObject) {
            // we don't know what is the last move
            board.removeObject(markerObject);
            markerObject = false; // don't put marker this time
          }
        }
      }
    }
  };
  let hoverObject: FieldBoardObject | null = null;
  const clearHoverObject = () => {
    if (hoverObject) {
      board.removeObject(hoverObject);
      hoverObject = null;
    }
  };
  board.on("mousemove", (_event, pos) => {
    const isValid = pos && game.isValid(pos.x, pos.y);
    if (!isValid) {
      clearHoverObject();
      return;
    }
    if (!hoverObject) {
      hoverObject = new FieldBoardObject(game.turn === Color.B ? "B" : "W");
    } else if (hoverObject.x === pos.x && hoverObject.y === pos.y) {
      return;
    } else {
      board.removeObject(hoverObject);
    }
    hoverObject.setPosition(pos.x, pos.y);
    board.addObject(hoverObject);
  });
  board.on("mouseout", clearHoverObject);
  board.on("click", (_event, { x, y }) => {
    const isValid = game.isValid(x, y);
    if (isValid) {
      clearHoverObject();
      game.play(x, y);
      updateFieldObjects();
      setColor(game.turn === Color.B ? "black" : "white");
      setCapCount(game.position.capCount);
      syncUp(game.positionStack);
    }
  });
  setColor(game.turn === Color.B ? "black" : "white");
  const syncDown = (positions: PositionData[]) => {
    if (game.positionStack.length === positions.length) return;
    while (game.positionStack.length < positions.length) {
      game.pushPosition(createPosition(positions[game.positionStack.length]));
    }
    while (game.positionStack.length > positions.length) {
      game.popPosition();
    }
    updateFieldObjects();
    setColor(game.turn === Color.B ? "black" : "white");
    setCapCount(game.position.capCount);
    clearHoverObject();
  };
  const pass = () => {
    game.pass();
    setColor(game.turn === Color.B ? "black" : "white");
    syncUp(game.positionStack);
  };
  const undo = () => {
    if (game.popPosition()) {
      updateFieldObjects();
      setColor(game.turn === Color.B ? "black" : "white");
      setCapCount(game.position.capCount);
      syncUp(game.positionStack);
    }
  };
  const resize = () => {
    board.setDimensions(element.clientWidth, element.clientHeight);
  };
  return { syncDown, pass, undo, resize };
};

export const GoBoard = memo<{
  roomId: string;
  userId: string;
  uniqueId?: string;
}>(({ roomId, userId, uniqueId }) => {
  const actionsRef = useRef<{
    syncDown: (positions: PositionData[]) => void;
    pass: () => void;
    undo: () => void;
    resize: () => void;
  }>();
  const syncDown = useMemo(() => {
    const cb = (positions: PositionData[]) => {
      if (!positions.length) return;
      if (actionsRef.current) {
        actionsRef.current.syncDown(positions);
      } else {
        setTimeout(() => {
          cb(positions);
        }, 1000);
      }
    };
    return cb;
  }, []);
  const { syncUp } = useGoBoard(roomId, userId, syncDown, uniqueId);
  const [color, setColor] = useState<"black" | "white">("black");
  const [capCount, setCapCount] = useState<{
    black: number;
    white: number;
  }>({ black: 0, white: 0 });
  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (divRef.current) {
      const div = divRef.current;
      const actions = createGoBoard(div, setColor, setCapCount, syncUp);
      actionsRef.current = actions;
      const observer = new MutationObserver(actions.resize);
      const region = div.parentNode?.parentNode;
      if (region) {
        observer.observe(region, {
          attributes: true,
          attributeFilter: ["style"],
        });
      }
      return () => {
        observer.disconnect();
      };
    }
    return undefined;
  }, [syncUp]);
  const pass = () => {
    if (actionsRef.current) {
      actionsRef.current.pass();
    }
  };
  const undo = () => {
    if (actionsRef.current) {
      actionsRef.current.undo();
    }
  };
  return (
    <div className="GoBoard-container">
      <div className="GoBoard-toolbar">
        Next Turn: {color === "black" ? "Black" : "White"}
        <button type="button" onClick={pass}>
          Pass
        </button>
        <button type="button" onClick={undo}>
          Undo
        </button>
        <div>
          Capture Count: Black {capCount.black}, White {capCount.white}
        </div>
      </div>
      <div className="GoBoard-canvas" ref={divRef} />
    </div>
  );
});

export default GoBoard;
