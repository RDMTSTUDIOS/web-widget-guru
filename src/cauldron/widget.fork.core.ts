import UAParser from "ua-parser-js"
import { WidgetWindow, Theme, ThemeChangeEvent, WidgetThemeInterface } from "./widget.interface";


/** ### Returns widget-window object
 * @interface:
 * 
 */
export function ForkWidgetWindow(): WidgetWindow {
    
    const [Root, Sandbox] = [document.createElement("div"), document.createElement("div")]


    const ClientOS = function(): string {
        const cache = new UAParser().getOS().name;
        return cache ? cache.replace(/ /g, '') : "UNIX";
    };

    /**### A widget-window theme interface
     * Allows to manage widget theme state
     * @interface `WidgetThemeInterface`
     * 
     * @getter `actual: Theme` - get current theme
     * @setter `onChange: (event: ThemeChangeEvent) => void` - set callback on theme change event
     * @method `makeDynamic(): void` - makes theme changes dynamic, theme changes as client theme do
     * @method `makeManual(): void` - makes theme changes manual
     * @method `set(theme: Theme): void`
     */
    const Theme = function(): WidgetThemeInterface {

        let DynamicFlag: boolean = false;
        let Actual: Theme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        let OnChange: (event: ThemeChangeEvent) => void = () => undefined;

        const dynamicHandler = (event: MediaQueryListEvent) => {
            let stop: boolean = false;
            OnChange({
                changedManually: false,
                toTheme: event.matches ? "dark" : "light",
                prevent: () => stop = true,
            });
            if (!stop) {
                Actual = event.matches ? "dark" : "light";
                Root.setAttribute("data-theme", Actual);
            };
        };

        const manualHandler = (theme: Theme) => {
            let stop: boolean = false;
            OnChange({
                changedManually: true,
                toTheme: theme,
                prevent: () => stop = true,
            });
            if (!stop) {
                Actual = theme;
                Root.setAttribute("data-theme", Actual);
            };
        };

        function makeDynamic(): boolean {
            if (!DynamicFlag) {
                dynamicHandler(new MediaQueryListEvent("change", {matches: window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches}));
                window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", dynamicHandler);
                DynamicFlag = true;
            };
            return false;
        };

        function makeManual(): boolean {
            if (DynamicFlag) {
                window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", dynamicHandler);
                DynamicFlag = false;
                return true;
            };
            return false;
        };
        
        return {
            get actual(): Theme {
                return Actual;
            },
            set actual(theme: Theme) {
                manualHandler(theme);
            },
            set onChange(callback: (event: ThemeChangeEvent) => void) {
                OnChange = callback;
            },
            makeDynamic,
            makeManual,
        };
    };

    const AssebleWindow = function(): void {
        Root.style.position = "fixed"
        Root.style.overflow = "hidden"
        
        Sandbox.style.position = "relative"
        Sandbox.style.minHeight = "100%"
        Sandbox.style.width = "100%"

        Root.appendChild(Sandbox)
    };


    function main() {
        AssebleWindow();

        return {
            get root() {
                return Root
            },
            get sandbox() {
                return Sandbox
            },
            theme: Theme(),
            os: ClientOS(),
        };
    };

   return main()
};