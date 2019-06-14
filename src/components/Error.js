import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, } from '@fortawesome/free-solid-svg-icons';
import { observer } from 'mobx-react-lite';

import StoreContext from '../utils/context';

const Error = observer(() => {

    const { beatmakerStore: { error, setError } } = useContext(StoreContext);

    return (
        <div className={`error ${error.length ? 'error-active' : ''}`}>
            {error}
            <FontAwesomeIcon icon={faTimes} onClick={() => setError('')} />
        </div>
    )
});

export default Error;