import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AccountItem from '~/components/AccountItem';
import * as searchServices from '~/apiServices/searchServices';
import TippyHeadless from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import { faCircleXmark, faMagnifyingGlass, faSpinner } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './Search.module.scss';
import { useEffect, useRef, useState } from 'react';
import { useDebounce } from '~/hooks';

const cx = classNames.bind(styles);

function Search() {
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [showResult, setShowResult] = useState(true);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef();

    let valueDebounced = useDebounce(searchValue, 500);

    const handleOnchange = (e) => {
        const temp = e.target.value;
        if (temp.startsWith(' ')) {
            return;
        }
        setSearchValue(e.target.value);
    };

    const handleClear = () => {
        setSearchValue('');
        setSearchResult([]);
        inputRef.current.focus();
    };

    useEffect(() => {
        if (!valueDebounced.trim()) {
            setSearchResult([]);
            return;
        }
        const fetchApi = async () => {
            setLoading(true);
            const result = await searchServices.search(valueDebounced);
            setSearchResult(result);
            setLoading(false);
        };
        fetchApi();
    }, [valueDebounced]);

    return (
        <div>
            <TippyHeadless
                onClickOutside={() => setShowResult(false)}
                visible={showResult && searchResult.length > 0}
                interactive
                render={(attrs) => (
                    <div className="box" tabIndex="-1" {...attrs}>
                        <PopperWrapper>
                            <h4 className={cx('search-title')}>Account</h4>
                            {searchResult.map((result) => {
                                return <AccountItem key={result.id} data={result} />;
                            })}
                        </PopperWrapper>
                    </div>
                )}
            >
                <div className={cx('search')}>
                    <input
                        placeholder="Search accounts and videos"
                        spellCheck={false}
                        value={searchValue}
                        onChange={handleOnchange}
                        ref={inputRef}
                        onFocus={() => setShowResult(true)}
                    />
                    {!!searchValue && !loading && (
                        <button className={cx('clear')} onClick={handleClear}>
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </button>
                    )}
                    {loading && <FontAwesomeIcon className={cx('loading')} icon={faSpinner} />}

                    <button className={cx('search-btn')} onMouseDown={(e) => e.preventDefault()}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                </div>
            </TippyHeadless>
        </div>
    );
}

export default Search;
