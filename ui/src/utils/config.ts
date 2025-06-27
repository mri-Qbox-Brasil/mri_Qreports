import { fetchNui } from './fetchNui';
import { isEnvBrowser } from './misc';

interface UIConfig {
  PrimaryColor: string;
}

interface Config {
  UI: UIConfig;
}

const defaultConfig: Config = {
  UI: {
    PrimaryColor: '#40c057'
  }
};

let cachedConfig: Config | null = null;


export const getConfig = async (): Promise<Config> => {
  if (cachedConfig) {
    return cachedConfig;
  }

  try {
    const config = await fetchNui<Config>('getConfig');
    if (config) {
      cachedConfig = config;
      return config;
    }
  } catch (error) {
    console.error('Failed to fetch config:', error);
  }

  return defaultConfig;
};

export const getPrimaryColor = async (): Promise<string> => {
  const config = await getConfig();
  return config.UI.PrimaryColor;
};


export const isValidColor = (color: string): boolean => {
  const tempElement = document.createElement('div');
  tempElement.style.color = color;
  return tempElement.style.color !== '';
};

export const convertToHex = (color: string): string => {
  if (/^#[0-9A-F]{6}$/i.test(color)) {
    return color;
  }
  
  const tempElement = document.createElement('div');
  tempElement.style.color = color;
  document.body.appendChild(tempElement);
  
  const computedColor = window.getComputedStyle(tempElement).color;
  document.body.removeChild(tempElement);
  
  if (computedColor.startsWith('rgb')) {
    const rgb = computedColor.match(/\d+/g);
    if (rgb && rgb.length >= 3) {
      const r = parseInt(rgb[0]);
      const g = parseInt(rgb[1]);
      const b = parseInt(rgb[2]);
      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }
  }
  
  return color;
};

export const updatePrimaryColor = async (color: string): Promise<void> => {
  try {
    if (!isValidColor(color)) {
      throw new Error(`Cor inválida: ${color}`);
    }
    
    const hexColor = convertToHex(color);
    
    if (!isEnvBrowser()) {
      await fetchNui('updatePrimaryColor', { color: hexColor });
    }
    
    if (cachedConfig) {
      cachedConfig.UI.PrimaryColor = hexColor;
    }
    
    window.dispatchEvent(new CustomEvent('updateThemeColor', { 
      detail: { primaryColor: hexColor } 
    }));
    
    console.log('Cor primária atualizada para:', hexColor);
    return Promise.resolve();
  } catch (error) {
    console.error('Falha ao atualizar cor primária:', error);
    throw error;
  }
};
