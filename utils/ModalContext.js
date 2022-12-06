import React, { createContext, useState } from 'react';


export const ModalContext = createContext();

const ModalContextProvider = (props) => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <ModalContext.Provider value={{ modalOpen, setModalOpen }} >
            {props.children}
        </ModalContext.Provider>
    )
}

export default ModalContextProvider;