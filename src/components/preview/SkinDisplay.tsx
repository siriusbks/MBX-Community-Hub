interface SkinDisplayProps {
  username: string;
  uuid: string;
  level: number;
}

export function SkinDisplay({ username, uuid, level }: SkinDisplayProps) {
  return (
    <div style={{
      width: '16rem',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      padding: '1rem',
      borderRadius: '0.5rem',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {username && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '0.5rem'
        }}>
          <p style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#ffffff',
          }}>
            {username}
          </p>
            <span style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#4ade80'
            }}>
              Level {level}
            </span>
          </div>
      )}
      {uuid ? (
        <img
          src={`https://vzge.me/full/832/${uuid}.png`}
          alt="Minecraft Skin"
          style={{
            width: '10rem',
            height: 'auto',
            imageRendering: 'pixelated'
          }}
          crossOrigin="anonymous"
        />
      ) : (
        <p style={{
          fontSize: '0.875rem',
          color: '#e5e7eb'
        }}>
          Enter a username
        </p>
      )}
    </div>
  );
}