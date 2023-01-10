import { userIconUrl } from '@/lib/api'
import { ResolvedTheme } from '@/lib/theme'

interface Props {
  author: string
  theme: ResolvedTheme
}

export const SmallPreview: React.FC<Props> = ({ author, theme }) => {
  // vercel og で使うために全部 style 直書きする

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        aspectRatio: '16 / 9',
        display: 'grid',
        position: 'relative',
        gridTemplateAreas:
          '"nav channel header header" "nav channel main   side"',
        gridTemplateColumns: '1fr 5fr 20fr 5fr',
        gridTemplateRows: '1fr 10fr',
        borderRadius: '2px',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          gridArea: 'nav',
          backgroundColor: theme.basic.background.secondary.default,
          display: 'flex',
          flexDirection: 'column',
          padding: '50% 10%',
          gap: '2.5%',
        }}
      >
        <div
          style={{
            backgroundColor: theme.basic.accent.primary.default,
            width: '80%',
            aspectRatio: '1 / 1',
            borderRadius: '9999px',
          }}
        />
        <div
          style={{
            width: '90%',
            aspectRatio: '1 / 1',
            display: 'grid',
            placeItems: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              backgroundColor: theme.basic.accent.primary.default,
              width: '60%',
              aspectRatio: '1 / 1',
              borderRadius: '9999px',
            }}
          />
          <div
            style={{
              backgroundColor: theme.basic.accent.primary.default,
              aspectRatio: '1 / 1',
              position: 'absolute',
              borderRadius: '9999px',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              opacity: '0.1',
            }}
          />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            style={{
              width: '90%',
              aspectRatio: '1 / 1',
              display: 'grid',
              placeItems: 'center',
            }}
            key={i}
          >
            <div
              style={{
                backgroundColor: theme.basic.accent.primary.default,
                width: '60%',
                aspectRatio: '1 / 1',
                borderRadius: '9999px',
                opacity: '0.3',
              }}
            />
          </div>
        ))}
      </div>
      <div
        style={{
          gridArea: 'channel',
          backgroundColor: theme.basic.background.secondary.default,
        }}
      ></div>
      <div
        style={{
          gridArea: 'header',
          backgroundColor: theme.basic.background.primary.default,
          borderBottom: `1px solid ${theme.basic.ui.tertiary.default}`,
          display: 'flex',
          paddingLeft: '2.5%',
          gap: '1%',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            backgroundColor: theme.basic.ui.secondary.inactive,
            borderRadius: '9999px',
            height: '50%',
            width: '20%',
          }}
        ></span>
        <span
          style={{
            backgroundColor: theme.basic.ui.secondary.default,
            borderRadius: '9999px',
            height: '50%',
            width: '20%',
          }}
        ></span>
      </div>
      <div
        style={{
          gridArea: 'main',
          backgroundColor: theme.basic.background.primary.default,
          overflow: 'hidden',
          padding: '1% 0',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '10%',
          }}
        >
          <div
            style={{
              display: 'grid',
              height: '5%',
              gridTemplateColumns: '1fr 20% 1fr',
              gap: '5%',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                height: '1px',
                backgroundColor: theme.basic.accent.notification.default,
              }}
            ></span>
            <span
              style={{
                height: '100%',
                borderRadius: '9999px',
                backgroundColor: theme.basic.accent.notification.default,
              }}
            ></span>
            <span
              style={{
                height: '1px',
                backgroundColor: theme.basic.accent.notification.default,
              }}
            ></span>
          </div>
          <div
            style={{
              display: 'grid',
              height: '5%',
              gridTemplateColumns: '1fr 20% 1fr',
              gap: '5%',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                height: '1px',
                backgroundColor: theme.basic.ui.secondary.default,
              }}
            ></span>
            <span
              style={{
                height: '100%',
                borderRadius: '9999px',
                backgroundColor: theme.basic.ui.secondary.default,
              }}
            ></span>
            <span
              style={{
                height: '1px',
                backgroundColor: theme.basic.ui.secondary.default,
              }}
            ></span>
          </div>
          <div
            style={{
              height: '30%',
              width: '100%',
              display: 'flex',
              padding: '0 5%',
              gap: '2.5%',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={userIconUrl(author)}
              style={{
                borderRadius: '9999px',
                aspectRatio: '1 / 1',
                height: '80%',
              }}
              alt=''
            />
            <div
              style={{
                fontSize: '0.5rem',
              }}
            >
              <div>
                <span
                  style={{
                    color: theme.basic.ui.primary.default,
                    fontWeight: 'bold',
                  }}
                >
                  Dummy
                </span>
                <span
                  style={{
                    color: theme.basic.ui.secondary.default,
                    backgroundColor: theme.basic.background.secondary.default,
                    fontWeight: 'bold',
                    borderRadius: '4px',
                    fontSize: '0.875em',
                    padding: '0.5% 2.5%',
                  }}
                >
                  TAG
                </span>
                <span
                  style={{
                    color: theme.basic.ui.secondary.default,
                    fontSize: '0.875em',
                  }}
                >
                  @dummy
                </span>
              </div>
              <div
                style={{
                  color: theme.basic.ui.primary.default,
                }}
              >
                Message Content
              </div>
            </div>
          </div>

          <div
            style={{
              width: '90%',
              alignSelf: 'center',
              height: '15%',
              backgroundColor: theme.basic.background.secondary.default,
              border: `1px solid ${theme.basic.accent.focus.default}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'end',
              paddingRight: '2.5%',
              marginTop: 'auto',
              marginBottom: '5%',
            }}
          >
            <div
              style={{
                width: '90%',
                height: '80%',
                backgroundColor: theme.basic.background.primary.default,
              }}
            ></div>
          </div>
        </div>
      </div>
      <div
        style={{
          gridArea: 'side',
          backgroundColor: theme.basic.background.secondary.default,
          display: 'flex',
          flexDirection: 'column',
          padding: '5%',
          gap: '2.5%',
        }}
      >
        <div
          style={{
            height: '5%',
            width: '60%',
            borderRadius: '9999px',
            backgroundColor: theme.basic.ui.primary.default,
          }}
        ></div>
        <div
          style={{
            height: '10%',
            width: '100%',
            backgroundColor: theme.basic.background.primary.default,
          }}
        ></div>
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            style={{
              height: '8%',
              width: '100%',
              backgroundColor: theme.basic.background.primary.default,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0 5%',
            }}
            key={i}
          >
            <div
              style={{
                height: '50%',
                width: '40%',
                backgroundColor: theme.basic.ui.secondary.default,
                borderRadius: '9999px',
              }}
            ></div>
            <div
              style={{
                height: '30%',
                aspectRatio: '1 / 1',
                backgroundColor: theme.basic.ui.secondary.default,
              }}
            ></div>
          </div>
        ))}
        <div
          style={{
            height: '20%',
            width: '100%',
            backgroundColor: theme.basic.background.primary.default,
          }}
        ></div>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '0',
          left: '2.5%',
          width: '20%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column-reverse',
          paddingBottom: '2.5%',
          gap: '2.5%',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '10%',
            backgroundColor: theme.basic.accent.primary.default,
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        ></div>
        <div
          style={{
            width: '100%',
            height: '10%',
            backgroundColor: theme.basic.ui.secondary.background,
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        ></div>
        <div
          style={{
            width: '100%',
            height: '10%',
            backgroundColor: theme.basic.accent.error.default,
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        ></div>
      </div>
    </div>
  )
}
