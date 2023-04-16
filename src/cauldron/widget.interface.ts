
export type Theme = "light" | "dark"

export interface ThemeChangeEvent {
    /**
     * `boolean` theme change was triggered dynamically from client sys theme changes or manually - by setting {@linkcode WidgetThemeInterface.actual} **set accessor**
     */
    readonly changedManually: boolean,

    /**
     * To which theme of type {@linkcode Theme} *theme change* was triggered
     */
    readonly toTheme: Theme,

    /**
     * Allows to prevent theme changing - works absolutely like {@linkcode Event.preventDefault()} for current Widget
     */
    prevent(): void,
}

export interface WidgetThemeInterface {
    
    /**
     * A getter for actual widget theme
     */
    get actual(): Theme,

    /**
     * A manual setter for actual widget theme
     * 
     * Manually triggers change widget theme event
     */
    set actual(theme: Theme),

    /**
     * Turns off dynamic theme changes due client to sys theme changes.
     * 
     * Returned boolean value - flag, if state changed: if *widget theme* was changing dynamically - now it's not, so return value is `true`,
     * otherwise - it's was only manualy changed already, so `false` is returned.
     */
    makeManual(): boolean,

    /**
     * Makes widget theme respond to client sys theme changes. This method also dispatches *initial* dynamic event on
     * theme changer so {@linkcode onChange} callback will also be triggered
     * 
     * Returned boolean value - flag, if state changed: if *widget theme* was changing only manually - now it will also be changed dynamically, so return value is `true`,
     * otherwise - it's was already also changing dynamically, so `false` is returned.
     */
    makeDynamic(): boolean,

    /**
     * On theme change event callback. Triggered on *manual* as well as on *dynamic* theme changes.
     * Lets you ispect event and prevent theme change
     * 
     * @param callback - (event: {@linkcode ThemeChangeEvent} => void)
     * 
     * Event interface:
     * @property {@linkcode ThemeChangeEvent.changedManually} - `boolean` theme change was triggered dynamically from client sys theme changes or manually - by setting **{@linkcode actual} accessor**
     * @property {@linkcode ThemeChangeEvent.toTheme} - to which theme of type {@linkcode Theme} *theme change* was triggered
     * @property {@linkcode ThemeChangeEvent.prevent()} - allows to prevent theme changing - works absolutely like `Event.preventDefault()`
     */
    set onChange(callback: (event: ThemeChangeEvent) => void),
};

export interface WidgetWindow {
    readonly root: HTMLElement,
    readonly sandbox: HTMLElement,
    readonly theme: WidgetThemeInterface
};