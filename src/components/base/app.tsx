import React, { useMemo, useState, useEffect, createContext, useContext } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import {
  faPalette,
  faEyeDropper,
  faMagnifyingGlassChart,
  faChartLine,
  faFont,
  faFileCode,
  faRulerCombined,
  faUniversalAccess,
  faWrench,
  faCameraRetro,
} from '@fortawesome/free-solid-svg-icons';

import { SideMenu } from './side-menu';
import { Logo } from './logo';
import { Runtime } from '@lib/chrome-api/runtime';
import { Tabs } from '@lib/chrome-api/tabs';

import { PaletteExtractor } from '../tools/palette-extractor';
import { ColorPicker } from '../tools/color-picker';
import { ElementPicker } from '../tools/element-picker';
import { SeoAnalyzer } from '../tools/seo-analyzer';
import { FontExtractor } from '../tools/font-extractor';
import { PixelPerfectTools } from '../tools/pixel-perfect';
import { AccessibilityChecker } from '../tools/accessibility/accessibility';
import { OptimizeChecker } from '../tools/optimize';
import { GifRecorder } from '../tools/gif-recorder';
import { CssSelector } from '../tools/css-selector';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: any;
  component: React.FC<{ tabId: number }>;
}

const Tools: Tool[] = [
  { id: 'palette-extractor',    name: 'Palette Extractor',    description: 'Extract a cohesive color scheme from any webpage.',          icon: faPalette,              component: PaletteExtractor },
  { id: 'color-picker',         name: 'Color Picker',         description: 'Pick and identify colors directly from a webpage.',             icon: faEyeDropper,           component: ColorPicker },
  { id: 'element-selector',     name: 'Element Inspector',    description: 'Inspect DOM elements and their CSS properties.',                icon: faMagnifyingGlassChart, component: ElementPicker },
  { id: 'seo-analyzer',         name: 'SEO Analyzer',         description: 'Analyze SEO metrics and receive actionable recommendations.',   icon: faChartLine,            component: SeoAnalyzer },
  { id: 'font-extractor',       name: 'Font Extractor',       description: 'Extract fonts and typography info from a webpage.',            icon: faFont,                 component: FontExtractor },
  { id: 'pixel-perfect-tools',  name: 'Pixel Perfect',        description: 'Measure distances and dimensions to ensure pixel-perfect design.', icon: faRulerCombined,      component: PixelPerfectTools },
  { id: 'accessibility-checker',name: 'Accessibility Checker', description: 'Audit website accessibility against WCAG standards.',            icon: faUniversalAccess,      component: AccessibilityChecker },
  { id: 'css-selector',         name: 'CSS Selector',         description: 'Test and highlight CSS selectors on the page.',                 icon: faFileCode,             component: CssSelector },
  { id: 'optimize',             name: 'Optimizer',            description: 'Audit and optimize page performance and resources.',            icon: faWrench,               component: OptimizeChecker },
  { id: 'gif-recorder',         name: 'GIF Recorder',         description: 'Record screen activity and generate high-quality GIFs.',        icon: faCameraRetro,          component: GifRecorder },
];

const TabContext = createContext<number | null>(null);
export const useTabId = () => {
  const tab = useContext(TabContext);
  if (tab === null) throw new Error('useTabId must be used within TabContext');
  return tab;
};

const App: React.FC = () => {
  const [activeToolId, setActiveToolId] = useState<string>(Tools[0].id);
  const [tabId, setTabId] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromQs = params.get('tabId');
    if (fromQs) {
      setTabId(Number(fromQs));
    } else {
      Tabs.getActive()
        .then(tab => {
          if (tab.id) setTabId(tab.id);
          else console.error('Active tab has no id');
        })
        .catch(err => console.error('Error getting active tab', err));
    }
  }, []);

  const ActiveTool = useMemo(
    () => Tools.find(tool => tool.id === activeToolId) ?? Tools[0],
    [activeToolId]
  );

  if (tabId === null) {
    return <Loading>Loading…</Loading>;
  }

  return (
    <TabContext.Provider value={tabId}>
      <GlobalStyles />

      <Container>
        <FixedHeader>
          <Header>
            <Logo />
          </Header>
          <Separator />
        </FixedHeader>

        <Content>
          <ActiveTool.component tabId={tabId} />
        </Content>

        <SideMenu
          tools={Tools}
          activeToolId={activeToolId}
          onSelectTool={setActiveToolId}
        />
      </Container>
    </TabContext.Provider>
  );
};

const Loading = styled.div`
  padding: 2rem;
  font-size: 1.2rem;
`;

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: #f5f5f5;
  }
  .axe-highlight { outline: 3px dashed orange; }
  .axe-marker    { z-index: 10001; }
  .optimize-highlight { outline: 3px solid blue !important; transition: outline 0.3s ease; }
`;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  background-color: var(--surface-200);
`;

const Content = styled.div`
  width: calc(100% - 2rem);
  padding: 4rem 1rem 1rem;
  flex: 1;
  background-color: var(--surface-50);
  overflow: auto;
`;

const FixedHeader = styled.div`
  position: fixed;
  top: 0;
  width: calc(100% - 2rem);
  background-color: var(--surface-50);
  z-index: 100;
`;

const Header = styled.div`
  padding: 1rem 0 0 1rem;
`;

const Separator = styled.div`
  width: 100%;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent 0%,
    var(--surface-border) 20%,
    var(--surface-border) 80%,
    transparent 100%
  );
  margin: 0.5rem 0;
`;

export { App };
export type { Tool };
