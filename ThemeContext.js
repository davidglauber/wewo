import React ,{createContext} from 'react';


export const ThemeContext = createContext();


export default function ThemeProviderStyle({children, dark, setDark}) {

    return(
        <ThemeContext.Provider value={{dark, setDark}}>
            {children}
        </ThemeContext.Provider>
    );
}
