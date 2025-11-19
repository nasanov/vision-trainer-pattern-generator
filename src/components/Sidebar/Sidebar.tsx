import type { Letter, PageSettings, Preset } from '../../types';
import { PageSettings as PageSettingsComponent } from './PageSettings';
import { PresetsSection } from './PresetsSection';
import { LetterEditor } from './LetterEditor';

type SidebarProps = {
  pageSettings: PageSettings;
  onUpdatePageSetting: (key: keyof PageSettings, value: string) => void;
  showFixation: boolean;
  onToggleFixation: (checked: boolean) => void;
  includeNumbers: boolean;
  onToggleNumbers: (checked: boolean) => void;
  allowDuplicates: boolean;
  onToggleDuplicates: (checked: boolean) => void;
  presets: Preset[];
  onLoadPreset: (preset: Preset) => void;
  isSaving: boolean;
  onStartSaving: () => void;
  onCancelSaving: () => void;
  newPresetName: string;
  onNameChange: (name: string) => void;
  saveError: string;
  onSavePreset: () => void;
  onDeletePreset: (name: string) => void;
  onClearError: () => void;
  selectedLetter: Letter | undefined;
  onUpdateLetter: (id: number, field: keyof Letter, value: string | number) => void;
};

export const Sidebar = ({
  pageSettings,
  onUpdatePageSetting,
  showFixation,
  onToggleFixation,
  includeNumbers,
  onToggleNumbers,
  allowDuplicates,
  onToggleDuplicates,
  presets,
  onLoadPreset,
  isSaving,
  onStartSaving,
  onCancelSaving,
  newPresetName,
  onNameChange,
  saveError,
  onSavePreset,
  onDeletePreset,
  onClearError,
  selectedLetter,
  onUpdateLetter,
}: SidebarProps) => {
  return (
    <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto no-print p-4 flex flex-col gap-6 shadow-lg z-10">
      <PageSettingsComponent
        pageSettings={pageSettings}
        onUpdatePageSetting={onUpdatePageSetting}
        showFixation={showFixation}
        onToggleFixation={onToggleFixation}
        includeNumbers={includeNumbers}
        onToggleNumbers={onToggleNumbers}
        allowDuplicates={allowDuplicates}
        onToggleDuplicates={onToggleDuplicates}
      />

      <PresetsSection
        presets={presets}
        onLoadPreset={onLoadPreset}
        isSaving={isSaving}
        onStartSaving={onStartSaving}
        onCancelSaving={onCancelSaving}
        newPresetName={newPresetName}
        onNameChange={onNameChange}
        saveError={saveError}
        onSavePreset={onSavePreset}
        onDeletePreset={onDeletePreset}
        onClearError={onClearError}
      />

      <LetterEditor selectedLetter={selectedLetter} onUpdateLetter={onUpdateLetter} />

      {/* Buy Me a Coffee Button */}
      <div className="flex justify-center mt-auto pt-4">
        <a href="https://www.buymeacoffee.com/nurs.asanov" target="_blank" rel="noopener noreferrer">
          <img
            src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
            alt="Buy Me A Coffee"
            style={{ height: '60px', width: '217px' }}
          />
        </a>
      </div>
    </aside>
  );
};
