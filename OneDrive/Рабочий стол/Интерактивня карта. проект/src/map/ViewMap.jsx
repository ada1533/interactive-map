import PropTypes from 'prop-types';
export const ViewMap = ({basemap, onChange}) => {
    ViewMap.propTypes = {
        // типизация с помощью PropTypes так как передаем 2 разные типы данных, без него будет работать но подчеркивается красным
        basemap: PropTypes.string,
        onChange: PropTypes.func,
    };
    const basemaps = {
        osm: 'OpenStreetMap',
        hot: 'Humanitarian',
        dark: 'Dark Mode',
        cycle: 'Cycle Map',
};

return (
    <div className="basemap-selector">
        {/* проходит по каждому ключу */}
        {Object.keys(basemaps).map((key) => (
            <button
                key={key}
                onClick={() => onChange(key)} // меняет ключ
                className={basemap === key ? 'active' : ''} // особый стиль для активной кнопки
            >
                {/* отображение кнопок */}
                {basemaps[key]} 
            </button>
        ))}
    </div>
);
};
