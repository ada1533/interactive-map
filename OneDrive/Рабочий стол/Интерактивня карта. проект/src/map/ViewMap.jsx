import PropTypes from 'prop-types';
export const ViewMap = ({basemap, onChange}) => {
    ViewMap.propTypes = {
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
        {Object.keys(basemaps).map((key) => (
            <button
                key={key}
                onClick={() => onChange(key)}
                className={basemap === key ? 'active' : ''}
            >
                {basemaps[key]}
            </button>
        ))}
    </div>
);
};
