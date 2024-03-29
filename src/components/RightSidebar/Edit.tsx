import { useEffect, memo, useState } from "react";
// hooks
import { useTypedSelector, useActions } from "../../hooks";
// socket
import socket from "../../socket";
// types
import { Element } from "../../utils/types";

const Edit = () => {
  const { selectedElement, elements } = useTypedSelector(
    (state) => state.canvas
  );

  // setters
  const { setSelectedElement, setElements } = useActions();

  const onChangeSelectedElement = (newAttrs: any) => {
    const newElement = {
      ...selectedElement,
      ...newAttrs,
    };

    setSelectedElement(newElement);
    setElements(
      elements.map((element: Element) =>
        element.id === selectedElement?.id ? newElement : element
      )
    );
  };

  return (
    <div className="pt-[15px] overflow-y-auto h-full px-[10px]">
      <div className="grid gap-[20px] grid-cols-1 divide-y">
        {selectedElement && (
          <>
            {selectedElement._type === "dynamic_image" && (
              <ImageFit
                position={selectedElement.pos}
                onChangeSelectedElement={onChangeSelectedElement}
              />
            )}
            {(selectedElement._type === "text" ||
              selectedElement._type === "qrcode") && (
                <ForDynamicReplacement
                  isReplace={selectedElement.isReplace}
                  onChangeSelectedElement={onChangeSelectedElement}
                />
              )}
            <div className="flex flex-col pt-[15px]">
              <Position
                x={selectedElement.x}
                y={selectedElement.y}
                onChangeSelectedElement={onChangeSelectedElement}
              />
              <Sizes
                width={selectedElement.width}
                height={selectedElement.height}
                onChangeSelectedElement={onChangeSelectedElement}
              />
            </div>
          </>
        )}

        {!selectedElement && <CanvasEdit />}

        {selectedElement && selectedElement._type === "text" && (
          <Textarea
            text={selectedElement.text}
            onChangeSelectedElement={onChangeSelectedElement}
          />
        )}

        {selectedElement && selectedElement._type === "text" && (
          <>
            <div className="pt-[15px]">
              {/* <span className="text-[18px]">Text</span> */}
              <FontFamily
                fontFamily={selectedElement.fontFamily}
                onChangeSelectedElement={onChangeSelectedElement}
              />
              <div className="flex mt-[7px]">
                <FontStyle
                  fontStyle={selectedElement.fontStyle}
                  onChangeSelectedElement={onChangeSelectedElement}
                />
                <FontSize
                  fontSize={selectedElement.fontSize}
                  onChangeSelectedElement={onChangeSelectedElement}
                />
              </div>
            </div>
          </>
        )}

        {selectedElement &&
          selectedElement._type !== ("image" || "dynamic_image") && (
            <div className="pt-[15px]">
              <FontColor
                fontColor={selectedElement.fill}
                onChangeSelectedElement={onChangeSelectedElement}
              />
            </div>
          )}
      </div>
    </div>
  );
};

type TextareaProps = {
  text: string | undefined;
  onChangeSelectedElement: (newAttrs: any) => void;
};
const Textarea = memo(({ text, onChangeSelectedElement }: TextareaProps) => {
  const [localText, setLocalText] = useState<undefined | string>("");

  useEffect(() => {
    setLocalText(text);
  }, [text]);

  const onHandleBlur = () => {
    onChangeSelectedElement({
      text: localText,
    });
  };

  return (
    <div className="mt-[5px] pt-[15px] flex rounded-md shadow-sm">
      <textarea
        value={localText}
        onChange={(e) => setLocalText(e.target.value)}
        onBlur={onHandleBlur}
        className="textarea textarea-bordered w-full"
        placeholder="Text..."
      ></textarea>
    </div>
  );
});

type ImageFitProps = {
  position: string | undefined;
  onChangeSelectedElement: (newAttrs: any) => void;
};
const ImageFit = memo(
  ({ position, onChangeSelectedElement }: ImageFitProps) => {
    const onHandleChange = (e: any) => {
      onChangeSelectedElement({
        pos: e.target.value,
      });
    };

    return (
      <div className="mt-[5px] flex rounded-md shadow-sm">
        <span className="inline-flex py-[5px] text-[16px] items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
          position
        </span>
        <select
          // onChange={(e: any) => onChangeFontFamily(e.target.value)}
          onChange={onHandleChange}
          className="w-full text-[16px] rounded-r-md border border-gray-300 bg-white px-3  focus:border-indigo-500 focus:border-[2px] focus:outline-none focus:ring-indigo-500 sm:text-sm"
        >
          <option selected={position === "centre"} value="сentre">
            centre
          </option>
          <option selected={position === "top"} value="top">
            top
          </option>
          <option selected={position === "right top"} value="right top">
            right top
          </option>
          <option selected={position === "right"} value="right">
            right
          </option>
          <option selected={position === "right bottom"} value="right bottom">
            right bottom
          </option>
          <option selected={position === "bottom"} value="bottom">
            bottom
          </option>
          <option selected={position === "left bottom"} value="left bottom">
            left bottom
          </option>
          <option selected={position === "left"} value="left">
            left
          </option>
          <option selected={position === "left top"} value="left top">
            left top
          </option>
        </select>
      </div>
    );
  }
);

type ForDynamicReplacementProps = {
  isReplace: boolean | undefined;
  onChangeSelectedElement: (newAttrs: any) => void;
};

const ForDynamicReplacement = ({
  isReplace,
  onChangeSelectedElement,
}: ForDynamicReplacementProps) => {
  return (
    <div className="flex flex-col">
      <div className="form-control">
        <label className="label py-0 cursor-pointer">
          <input
            type="checkbox"
            className="toggle toggle-secondary toggle-sm"
            checked={isReplace}
            onChange={(e) =>
              onChangeSelectedElement({ isReplace: e.target.checked })
            }
          />

          <span className="text-[17px] font-medium font-[Nunito]">
            For dynamic replacement
          </span>
        </label>
      </div>
    </div>
  );
};

type FontColorProps = {
  fontColor: string | undefined;
  onChangeSelectedElement: (newAttrs: any) => void;
};
const FontColor = memo(
  ({ fontColor, onChangeSelectedElement }: FontColorProps) => {
    const [localColor, setLocalColor] = useState<string | undefined>("#fff");

    useEffect(() => {
      setLocalColor(fontColor);
    }, [fontColor]);

    const onChangeColor = (color: string) => {
      onChangeSelectedElement({
        fill: color,
      });
      setLocalColor(color);
    };

    const onHandleBlur = () => {
      onChangeSelectedElement({
        fill: localColor,
      });
    };

    return (
      <div className="mt-1 flex rounded-md shadow-sm">
        <input
          value={localColor}
          onChange={(e) => onChangeColor(e.target.value)}
          className="flex cursor-pointer w-[40px] h-[25px]  text-[16px] items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-2 text-sm text-gray-500"
          type="color"
        />
        <input
          value={localColor}
          onChange={(e) => setLocalColor(e.target.value)}
          onBlur={onHandleBlur}
          className="w-[35%] px-[6px]  h-[25px] py-[5px] rounded-r-md border border-gray-300 outline-none focus:border-indigo-500 focus:border-[2px] focus:ring-indigo-500 sm:text-sm"
          type="text"
        />
      </div>
    );
  }
);

type FontStyleProps = {
  fontStyle: string | undefined;
  onChangeSelectedElement: (newAttrs: any) => void;
};
const FontStyle = memo(
  ({ fontStyle, onChangeSelectedElement }: FontStyleProps) => {
    const onChangeFontStyle = (style: string) => {
      onChangeSelectedElement({
        fontStyle: style,
      });
    };

    return (
      <div className="mt-[5px] mr-[10px] w-full">
        <select
          onChange={(e: any) => onChangeFontStyle(e.target.value)}
          className="text-[16px] focus:py-[5px] py-[6px] w-full rounded-md border border-gray-300 bg-white px-[5px] focus:px-[4px]  focus:border-indigo-500 focus:border-[2px] focus:outline-none focus:ring-indigo-500 sm:text-sm"
        >
          <option selected={fontStyle === "normal"} value="normal">
            Medium
          </option>
          <option selected={fontStyle === "bold"} value="bold">
            Bold
          </option>
        </select>
      </div>
    );
  }
);

type FontSizeProps = {
  fontSize: number | undefined;
  onChangeSelectedElement: (newAttrs: any) => void;
};
const FontSize = memo(
  ({ fontSize, onChangeSelectedElement }: FontSizeProps) => {
    const [localFontSize, setLocalFontSize] = useState<number | undefined>(0);

    useEffect(() => {
      setLocalFontSize(fontSize);
    }, [fontSize]);

    const onHandleBlur = () => {
      onChangeSelectedElement({
        fontSize: localFontSize,
      });
    };

    return (
      <div className="mt-[5px] ml-[10px] w-full">
        <input
          value={localFontSize}
          onChange={(e: any) => setLocalFontSize(Number(e.target.value))}
          onBlur={onHandleBlur}
          className="w-full focus:py-[4px] py-[5px] text-[16px] focus:px-[9px] px-[10px] rounded-md border border-gray-300 outline-none focus:border-indigo-500 focus:border-[2px] focus:ring-indigo-500 sm:text-sm"
          type="number"
        />
      </div>
    );
  }
);

type FontFamilyProps = {
  fontFamily: string | undefined;

  onChangeSelectedElement: (newAttrs: any) => void;
};
const FontFamily = memo(
  ({
    fontFamily,

    onChangeSelectedElement,
  }: FontFamilyProps) => {
    const onChangeFontFamily = (font: string) => {
      onChangeSelectedElement({
        fontFamily: font,
      });
    };
    return (
      <div className="mt-[5px] flex rounded-md shadow-sm">
        <span className="inline-flex py-[5px] text-[16px] items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
          font
        </span>
        <select
          onChange={(e: any) => onChangeFontFamily(e.target.value)}
          className="w-full text-[16px] rounded-r-md border border-gray-300 bg-white px-3  focus:border-indigo-500 focus:border-[2px] focus:outline-none focus:ring-indigo-500 sm:text-sm"
        >
          <option selected={fontFamily === "Roboto"} value="Roboto">
            Roboto
          </option>
          {/* <option selected={fontFamily === "Nunito"} value="Nunito">
            Nunito
          </option>
          <option selected={fontFamily === "Montserrat"} value="Montserrat">
            Montserrat
          </option> */}
        </select>
      </div>
    );
  }
);

type PositionProps = {
  x: number;
  y: number;

  onChangeSelectedElement: (newAttrs: any) => void;
};
const Position = memo(
  ({
    x,
    y,

    onChangeSelectedElement,
  }: PositionProps) => {
    const [localX, setLocalX] = useState<number>(0);
    const [localY, setLocalY] = useState<number>(0);

    useEffect(() => {
      setLocalX(x);
      setLocalY(y);
    }, [x, y]);

    const onHandleBlur = (type: string, value: number) => {
      onChangeSelectedElement({
        [type]: value,
      });
    };

    return (
      <div className="flex">
        <div className="mt-1 mr-[10px] flex rounded-md shadow-sm">
          <span className="inline-flex py-[3px] w-[50px] text-[16px] items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-2 text-sm text-gray-500">
            X
          </span>
          <input
            value={localX}
            onChange={(e) => setLocalX(Number(e.target.value))}
            onBlur={() => onHandleBlur("x", localX)}
            className="w-full px-[10px] rounded-r-md border border-gray-300 outline-none focus:border-indigo-500 focus:border-[2px] focus:ring-indigo-500 sm:text-sm"
            type="number"
          />
        </div>
        <div className="mt-1 ml-[10px] flex rounded-md shadow-sm">
          <span className="inline-flex py-[3px] w-[50px] text-[16px] items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-2 text-sm text-gray-500">
            Y
          </span>
          <input
            value={localY}
            onChange={(e) => setLocalY(Number(e.target.value))}
            onBlur={() => onHandleBlur("y", localY)}
            className="w-full px-[10px] rounded-r-md border border-gray-300 outline-none focus:border-indigo-500 focus:border-[2px] focus:ring-indigo-500 sm:text-sm"
            type="number"
          />
        </div>
      </div>
    );
  }
);

const CanvasEdit = () => {
  // getters
  const { canvasWidth, canvasHeight } = useTypedSelector(
    (state) => state.canvas
  );

  // setters
  const { setCanvasWidth, setCanvasHeight } = useActions();

  const [localCanvasWidth, setLocalCanvasWidth] = useState(0);
  const [localCanvasHeight, setLocalCanvasHeight] = useState(0);

  useEffect(() => {
    setLocalCanvasHeight(canvasHeight);
    setLocalCanvasWidth(canvasWidth);
  }, [canvasHeight, canvasWidth]);

  const onHandleBlur = (pos: string, value: number) => {
    if (pos === "x") {
      setCanvasWidth(value);
      socket.emit("changeCanvasWidthServer", { id: 3, size: value });
    }

    if (pos === "y") {
      setCanvasHeight(value);
      socket.emit("changeCanvasHeightServer", { id: 3, size: value });
    }
  };

  return (
    <div className="flex mt-[5px]">
      <div className="mt-1 mr-[10px] flex rounded-md shadow-sm">
        <span className="inline-flex py-[3px] w-[50px] text-[16px] items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-2 text-sm text-gray-500">
          W
        </span>
        <input
          value={localCanvasWidth}
          onChange={(e) => setLocalCanvasWidth(Number(e.target.value))}
          onBlur={() => onHandleBlur("x", localCanvasWidth)}
          className="w-full px-[10px] rounded-r-md border border-gray-300 outline-none focus:border-indigo-500 focus:border-[2px] focus:ring-indigo-500 sm:text-sm"
          type="number"
        />
      </div>
      <div className="mt-1 ml-[10px] flex rounded-md shadow-sm">
        <span className="inline-flex py-[3px] w-[50px] text-[16px] items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-2 text-sm text-gray-500">
          H
        </span>
        <input
          value={localCanvasHeight}
          onChange={(e) => setLocalCanvasHeight(Number(e.target.value))}
          onBlur={() => onHandleBlur("y", localCanvasHeight)}
          className="w-full px-[10px] rounded-r-md border border-gray-300 outline-none focus:border-indigo-500 focus:border-[2px] focus:ring-indigo-500 sm:text-sm"
          type="number"
        />
      </div>
    </div>
  );
};

type SizesProps = {
  width: number;
  height: number;

  onChangeSelectedElement: (newAttrs: any) => void;
};
const Sizes = memo(
  ({
    width,
    height,

    onChangeSelectedElement,
  }: SizesProps) => {
    const [localWidth, setLocalWidth] = useState(0);
    const [localHeight, setLocalHeight] = useState(0);

    useEffect(() => {
      setLocalWidth(width);
      setLocalHeight(height);
    }, [width, height]);

    const onHandleBlur = (type: string, value: number) => {
      onChangeSelectedElement({
        [type]: value,
      });
    };

    return (
      <div className="flex mt-[10px]">
        <div className="mt-1 mr-[10px] flex rounded-md shadow-sm">
          <span className="inline-flex py-[3px] w-[50px] text-[16px] items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-2 text-sm text-gray-500">
            W
          </span>
          <input
            value={localWidth}
            onChange={(e) => setLocalWidth(Number(e.target.value))}
            onBlur={() => onHandleBlur("width", localWidth)}
            className="w-full px-[10px] rounded-r-md border border-gray-300 outline-none focus:border-indigo-500 focus:border-[2px] focus:ring-indigo-500 sm:text-sm"
            type="number"
          />
        </div>
        <div className="mt-1 ml-[10px] flex rounded-md shadow-sm">
          <span className="inline-flex py-[3px] w-[50px] text-[16px] items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-2 text-sm text-gray-500">
            H
          </span>
          <input
            value={localHeight}
            onChange={(e) => setLocalHeight(Number(e.target.value))}
            onBlur={() => onHandleBlur("height", localHeight)}
            className="w-full px-[10px] rounded-r-md border border-gray-300 outline-none focus:border-indigo-500 focus:border-[2px] focus:ring-indigo-500 sm:text-sm"
            type="number"
          />
        </div>
      </div>
    );
  }
);

export default Edit;
