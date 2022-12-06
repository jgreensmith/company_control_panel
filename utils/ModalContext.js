import React, { createContext, useState } from 'react';


export const ModalContext = createContext();

const ModalContextProvider = (props) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [currentId, setCurrentId] = useState(null);


    return (
        <ModalContext.Provider value={{ modalOpen, setModalOpen, currentId, setCurrentId }} >
            {props.children}
        </ModalContext.Provider>
    )
}

export default ModalContextProvider;