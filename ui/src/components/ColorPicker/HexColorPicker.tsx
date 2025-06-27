import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Popover,
  TextField,
  Tooltip,
  styled,
  Typography,
  IconButton,
} from "@mui/material";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import ColorizeIcon from "@mui/icons-material/Colorize";
import { useTheme } from "../../contexts/ThemeContext";
import { isValidColor } from "../../utils/config";
import { isEnvBrowser } from "../../utils/misc";

const ColorButton = styled(Button)(() => ({
  position: "fixed",
  bottom: 20,
  right: 20,
  zIndex: 9999,
  minWidth: "unset",
  width: 56,
  height: 56,
  borderRadius: "50%",
}));

const ColorPickerContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  width: 300,
  color: "#D9D9D9",
  "& .MuiTextField-root label": {
    color: "#D9D9D9",
  },
  "& .MuiInputBase-input": {
    color: "#D9D9D9",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(217, 217, 217, 0.5)",
  },
  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(217, 217, 217, 0.7)",
  },
}));

const ColorGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)",
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

const ColorGridItem = styled(Box)<{ color: string }>(({ color }) => ({
  width: 30,
  height: 30,
  backgroundColor: color,
  borderRadius: 4,
  cursor: "pointer",
  "&:hover": {
    transform: "scale(1.1)",
    boxShadow: "0 0 5px rgba(0,0,0,0.3)",
  },
}));

const ColorPreview = styled(Box)<{ color: string }>(({ color }) => ({
  width: "100%",
  height: 40,
  backgroundColor: color,
  borderRadius: 4,
  marginBottom: 8,
  border: "1px solid rgba(0,0,0,0.1)",
  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)",
}));

const ColorPalette = styled(Box)({
  width: "100%",
  height: 150,
  position: "relative",
  borderRadius: 4,
  overflow: "hidden",
  cursor: "crosshair",
  background:
    "linear-gradient(to bottom, rgba(0,0,0,0) 0%, #000 100%), linear-gradient(to right, #fff 0%, transparent 100%), linear-gradient(to right, red 0%, yellow 17%, lime 33%, cyan 50%, blue 66%, magenta 83%, red 100%)",
});

const ColorPicker = styled(Box)({
  width: 10,
  height: 10,
  borderRadius: "50%",
  border: "2px solid white",
  boxShadow: "0 0 2px rgba(0,0,0,0.5)",
  position: "absolute",
  transform: "translate(-50%, -50%)",
  pointerEvents: "none",
});

const EyeDropperButton = styled(IconButton)({
  color: "#D9D9D9",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
});

const predefinedColors = [
  "#f44336",
  "#e91e63",
  "#9c27b0",
  "#673ab7",
  "#3f51b5",
  "#2196f3",
  "#03a9f4",
  "#00bcd4",
  "#009688",
  "#4caf50",
  "#8bc34a",
  "#cddc39",
  "#ffeb3b",
  "#ffc107",
  "#ff9800",
  "#ff5722",
  "#795548",
  "#9e9e9e",
  "#607d8b",
  "#000000",
];

const getColorFromPosition = (
  x: number,
  y: number,
  width: number,
  height: number
): string => {
  const normX = Math.max(0, Math.min(1, x / width));
  const normY = Math.max(0, Math.min(1, y / height));
  const hue = normX * 360;
  let saturation = 1;
  let lightness = 0.5;

  if (normY < 0.5) {
    saturation = normY * 2;
    lightness = 1 - normY * 0.5;
  } else {
    saturation = 1;
    lightness = 0.5 - (normY - 0.5) * 0.5;
  }

  return hslToHex(hue, saturation * 100, lightness * 100);
};

const hslToHex = (h: number, s: number, l: number): string => {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const HexColorPicker: React.FC = () => {
  const { themeConfig, updatePrimaryColor } = useTheme();

  const paletteRef = useRef<HTMLDivElement>(null);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [color, setColor] = useState<string>(themeConfig.primary);
  const [hexValue, setHexValue] = useState<string>(themeConfig.primary);
  const [pickerPosition, setPickerPosition] = useState({ x: 0, y: 0 });
  const [isEyeDropperActive, setIsEyeDropperActive] = useState(false);

  useEffect(() => {
    setColor(themeConfig.primary);
    setHexValue(themeConfig.primary);
  }, [themeConfig.primary]);

  if (!isEnvBrowser()) {
    return null;
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHexValue(value);

    if (/^#[0-9A-F]{6}$/i.test(value)) {
      setColor(value);
    }
  };

  const handleApply = () => {
    if (isValidColor(color)) {
      updatePrimaryColor(color);
      handleClose();
    }
  };

  const handleColorSelect = (selectedColor: string) => {
    setColor(selectedColor);
    setHexValue(selectedColor);
    updatePrimaryColor(selectedColor);
  };

  const handlePaletteClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!paletteRef.current) return;

    const rect = paletteRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPickerPosition({ x, y });

    const newColor = getColorFromPosition(x, y, rect.width, rect.height);
    setColor(newColor);
    setHexValue(newColor);
  };

  const handleEyeDropper = async () => {
    if (typeof (window as any).EyeDropper !== "undefined") {
      try {
        setIsEyeDropperActive(true);
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        const newColor = result.sRGBHex;

        setColor(newColor);
        setHexValue(newColor);
        updatePrimaryColor(newColor);
      } catch (error) {
        console.error("Erro ao usar o conta-gotas:", error);
      } finally {
        setIsEyeDropperActive(false);
      }
    } else {
      alert(
        "Seu navegador não suporta a API EyeDropper. Use um navegador mais recente como Chrome ou Edge."
      );
    }
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Tooltip title="Mudar Cor Primária (Apenas Desenvolvimento)">
        <ColorButton
          variant="contained"
          color="primary"
          onClick={handleClick}
          aria-label="color picker"
        >
          <ColorLensIcon />
        </ColorButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            backgroundColor: "#00000098",
            backgroundImage: "none",
          },
        }}
      >
        <ColorPickerContainer>
          <ColorPreview color={color} />
          <ColorPalette ref={paletteRef} onClick={handlePaletteClick}>
            <ColorPicker
              style={{
                left: pickerPosition.x,
                top: pickerPosition.y,
                backgroundColor: color,
              }}
            />
          </ColorPalette>

          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <TextField
              label="Cor Hex"
              size="small"
              value={hexValue}
              onChange={handleHexChange}
              placeholder="#RRGGBB"
              fullWidth
              inputProps={{
                style: { fontFamily: "monospace" },
              }}
            />
            <EyeDropperButton
              onClick={handleEyeDropper}
              disabled={isEyeDropperActive}
              title="Conta-gotas"
            >
              <ColorizeIcon />
            </EyeDropperButton>
          </Box>

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 1 }}
            onClick={handleApply}
          >
            Aplicar
          </Button>

          <Typography
            variant="subtitle2"
            sx={{ mt: 2, mb: 1, color: "#D9D9D9" }}
          >
            Cores Predefinidas
          </Typography>

          <ColorGrid>
            {predefinedColors.map((presetColor) => (
              <ColorGridItem
                key={presetColor}
                color={presetColor}
                onClick={() => handleColorSelect(presetColor)}
              />
            ))}
          </ColorGrid>
        </ColorPickerContainer>
      </Popover>
    </>
  );
};

export default HexColorPicker;
