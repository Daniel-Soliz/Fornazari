import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  RotateCcw,
  Save,
  Upload,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { StoreSettings } from '../../types/fornazari';
import { validateBackupPayload } from '../../utils/storage';

export const AdminSettingsBackup: React.FC<{ activeTab: 'settings' | 'backup' }> = ({
  activeTab,
}) => {
  const {
    settings,
    updateSettings,
    exportBackupJson,
    importBackupPayload,
    restoreAllDemoData,
    showToast,
  } = useStore();

  const [draft, setDraft] = useState<StoreSettings>(settings);
  const [confirmRestore, setConfirmRestore] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(settings);
  }, [settings]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(draft);
  };

  const handleDownloadBackup = () => {
    const payload = exportBackupJson();
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fornazari-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup JSON exportado.', 'success');
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed: unknown = JSON.parse(text);
      const check = validateBackupPayload(parsed);
      if (!check.valid || !check.payload) {
        setImportError(check.error || 'Estrutura de backup inválida.');
        return;
      }
      importBackupPayload(check.payload);
    } catch {
      setImportError('O arquivo selecionado não é um JSON válido.');
    } finally {
      e.target.value = '';
    }
  };

  if (activeTab === 'backup') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-display font-bold text-xl text-[#073B2B]">
            Backup e Restauração de Dados
          </h2>
          <p className="text-xs text-[#20322A]/65 mt-0.5">
            Exporte todos os produtos, pedidos, serviços, textos e mídias em JSON ou restaure o conjunto demonstrativo original.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Export */}
          <div className="bg-white rounded-xl border border-[#20322A]/10 p-6 space-y-4">
            <h3 className="font-display font-bold text-base text-[#073B2B]">
              Exportar Backup Completo (JSON)
            </h3>
            <p className="text-xs sm:text-sm text-[#20322A]/75 leading-relaxed">
              Gera um arquivo <code className="font-mono-num">.json</code> contendo todas as configurações, textos editados, produtos, serviços, mídia e pedidos armazenados neste navegador.
            </p>
            <button
              type="button"
              onClick={handleDownloadBackup}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#115C39] text-white text-xs sm:text-sm font-semibold hover:bg-[#073B2B] cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Exportar arquivo JSON
            </button>
          </div>

          {/* Import */}
          <div className="bg-white rounded-xl border border-[#20322A]/10 p-6 space-y-4">
            <h3 className="font-display font-bold text-base text-[#073B2B]">
              Importar Backup (JSON)
            </h3>
            <p className="text-xs sm:text-sm text-[#20322A]/75 leading-relaxed">
              O arquivo é validado antes de substituir os dados atuais para evitar perda acidental ou conteúdo corrompido.
            </p>
            {importError && (
              <div className="p-3 rounded-lg bg-[#D73F38]/10 border border-[#D73F38]/25 text-xs font-medium text-[#D73F38]">
                {importError}
              </div>
            )}
            <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#20322A]/18 bg-[#F8F9F6] text-xs sm:text-sm font-semibold text-[#20322A] hover:bg-[#E9F3ED] cursor-pointer">
              <Upload className="w-4 h-4 text-[#115C39]" />
              Selecionar arquivo JSON
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Restore Demo Data */}
        <div className="bg-white rounded-xl border border-[#D73F38]/25 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <h3 className="font-display font-bold text-base text-[#D73F38] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Restaurar dados demonstrativos originais
            </h3>
            <p className="text-xs text-[#20322A]/75 leading-relaxed">
              Apaga alterações locais e restaura os 10 produtos de exemplo, textos originais da Fornazari, serviços e galeria inicial. Recomendado exportar um backup antes.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setConfirmRestore(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D73F38] text-white text-xs sm:text-sm font-semibold hover:bg-[#b9322c] cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <RotateCcw className="w-4 h-4" />
            Restaurar dados iniciais
          </button>
        </div>

        {confirmRestore && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#073B2B]/50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-[#20322A]/10">
              <h3 className="font-display font-bold text-lg text-[#073B2B]">
                Confirmar restauração completa?
              </h3>
              <p className="text-sm text-[#20322A]/75">
                Todos os produtos editados, pedidos locais e customizações da página inicial neste navegador serão substituídos pelo conjunto demonstrativo inicial.
              </p>
              <div className="flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setConfirmRestore(false)}
                  className="px-4 py-2 rounded-lg border border-[#20322A]/15 text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    restoreAllDemoData();
                    setConfirmRestore(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#D73F38] text-white text-xs font-semibold cursor-pointer"
                >
                  Sim, restaurar agora
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSaveSettings} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl text-[#073B2B]">
            Configurações da Empresa
          </h2>
          <p className="text-xs text-[#20322A]/65 mt-0.5">
            Dados institucionais, canais de WhatsApp, horários, retirada e ativação do modo comercial.
          </p>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#115C39] text-white text-xs sm:text-sm font-semibold hover:bg-[#073B2B] cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          Salvar configurações
        </button>
      </div>

      {/* Demo vs Commercial Mode */}
      <div className="bg-white rounded-xl border border-[#20322A]/10 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-display font-bold text-base text-[#073B2B]">
              Modo de Operação da Loja
            </h3>
            <p className="text-xs text-[#20322A]/70 mt-0.5">
              Por segurança, o modo demonstração impede o envio de itens com preços ilustrativos como encomendas reais via WhatsApp.
            </p>
          </div>
          <div className="flex items-center gap-2 p-1 bg-[#F8F9F6] rounded-xl border border-[#20322A]/10 self-start">
            <button
              type="button"
              onClick={() => setDraft({ ...draft, demoMode: true })}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                draft.demoMode
                  ? 'bg-[#20322A] text-white'
                  : 'text-[#20322A]/70 hover:bg-white'
              }`}
            >
              Modo Demonstração
            </button>
            <button
              type="button"
              onClick={() => setDraft({ ...draft, demoMode: false })}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                !draft.demoMode
                  ? 'bg-[#115C39] text-white'
                  : 'text-[#20322A]/70 hover:bg-white'
              }`}
            >
              Modo Comercial
            </button>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#F8F9F6] border border-[#20322A]/10 text-xs text-[#20322A]/80 flex items-start gap-2.5">
          {draft.demoMode ? (
            <>
              <AlertTriangle className="w-4 h-4 text-[#D73F38] shrink-0 mt-0.5" />
              <span>
                <strong>Modo Demonstração ativo:</strong> a loja exibe o aviso &ldquo;Demonstração — preços ilustrativos&rdquo; e bloqueia o disparo de pedidos fictícios para o WhatsApp da loja.
              </span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-[#115C39] shrink-0 mt-0.5" />
              <span>
                <strong>Modo Comercial ativo:</strong> certifique-se de ter removido os produtos fictícios e confirmado os preços reais. O botão de envio automático via WhatsApp ficará liberado após finalizar o carrinho.
              </span>
            </>
          )}
        </div>
      </div>

      {/* Identidade e Contatos */}
      <div className="bg-white rounded-xl border border-[#20322A]/10 p-5 sm:p-6 space-y-4">
        <h3 className="font-display font-bold text-base text-[#073B2B] border-b border-[#20322A]/8 pb-3">
          Dados Comerciais e Canais
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Nome comercial</label>
            <input
              type="text"
              value={draft.businessName}
              onChange={(e) => setDraft({ ...draft, businessName: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">E-mail</label>
            <input
              type="email"
              value={draft.email}
              onChange={(e) => setDraft({ ...draft, email: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Telefone Principal</label>
            <input
              type="text"
              value={draft.phonePrimary}
              onChange={(e) => setDraft({ ...draft, phonePrimary: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-sm font-mono-num"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Telefone Secundário</label>
            <input
              type="text"
              value={draft.phoneSecondary}
              onChange={(e) => setDraft({ ...draft, phoneSecondary: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-sm font-mono-num"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">
              WhatsApp Clínica (somente números com DDI)
            </label>
            <input
              type="text"
              value={draft.whatsappVet}
              onChange={(e) => setDraft({ ...draft, whatsappVet: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-sm font-mono-num"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">
              WhatsApp Pet Shop (somente números com DDI)
            </label>
            <input
              type="text"
              value={draft.whatsappPetShop}
              onChange={(e) => setDraft({ ...draft, whatsappPetShop: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-sm font-mono-num"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">Endereço completo</label>
          <input
            type="text"
            value={draft.address}
            onChange={(e) => setDraft({ ...draft, address: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">Link Google Maps</label>
          <input
            type="url"
            value={draft.googleMapsUrl}
            onChange={(e) => setDraft({ ...draft, googleMapsUrl: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-xs font-mono-num"
          />
        </div>
      </div>

      {/* Horários, Retirada, Cores e Rodapé */}
      <div className="bg-white rounded-xl border border-[#20322A]/10 p-5 sm:p-6 space-y-4">
        <h3 className="font-display font-bold text-base text-[#073B2B] border-b border-[#20322A]/8 pb-3">
          Horários, Retirada e Aparência
        </h3>

        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1">
              Banho e Tosa — Segunda a Quinta
            </label>
            <input
              type="text"
              value={draft.groomingHoursWeekdays}
              onChange={(e) =>
                setDraft({ ...draft, groomingHoursWeekdays: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">
              Banho e Tosa — Sexta e Sábado
            </label>
            <input
              type="text"
              value={draft.groomingHoursWeekend}
              onChange={(e) =>
                setDraft({ ...draft, groomingHoursWeekend: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">
              Orientação de retirada na loja
            </label>
            <textarea
              rows={2}
              value={draft.pickupNotice}
              onChange={(e) => setDraft({ ...draft, pickupNotice: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">
              Texto de direitos no rodapé
            </label>
            <input
              type="text"
              value={draft.footerCopyright}
              onChange={(e) =>
                setDraft({ ...draft, footerCopyright: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold mb-1">Verde Institucional</label>
            <input
              type="color"
              value={draft.primaryColor}
              onChange={(e) => setDraft({ ...draft, primaryColor: e.target.value })}
              className="w-full h-10 rounded-lg cursor-pointer border border-[#20322A]/15"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Verde Profundo</label>
            <input
              type="color"
              value={draft.deepColor}
              onChange={(e) => setDraft({ ...draft, deepColor: e.target.value })}
              className="w-full h-10 rounded-lg cursor-pointer border border-[#20322A]/15"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Vermelho Marca</label>
            <input
              type="color"
              value={draft.accentRed}
              onChange={(e) => setDraft({ ...draft, accentRed: e.target.value })}
              className="w-full h-10 rounded-lg cursor-pointer border border-[#20322A]/15"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#115C39] text-white text-sm font-semibold hover:bg-[#073B2B] cursor-pointer"
        >
          <Save className="w-4 h-4" />
          Salvar configurações da empresa
        </button>
      </div>
    </form>
  );
};
