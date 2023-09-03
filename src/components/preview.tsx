import React from 'react'

import { userIconUrl } from '@/utils/api'

import type { ResolvedTheme } from '@/utils/theme'

interface Props {
  author: string
  theme: ResolvedTheme
  className?: string
  ogp?: boolean
}

export const SmallPreview: React.FC<Props> = props => {
  // vercel og で使うために全部 style 直書きする

  return (
    <div
      style={{
        display: 'flex',
        background: 'white',
      }}
      className={props.className}
    >
      <div
        style={{
          display: 'flex',
          width: '100%',
          background: props.theme.basic.background.secondary.default,
        }}
      >
        <FixRatioBox
          ratio={props.ogp === true ? '40:21' : '16:9'}
          style={{
            height: '100%',
            width: '100%',
            // aspectRatio: '16 / 9',
            position: 'relative',
            display: 'flex',
            flexDirection: 'row',
            borderRadius: '2px',
            overflow: 'hidden',
            userSelect: 'none',
            background: props.theme.basic.background.tertiary.default,
          }}
        >
          <div
            style={{
              width: '3.3%',
              height: '100%',
              display: 'flex',
            }}
          >
            <Nav {...props} />
          </div>
          <div
            style={{
              width: '16.5%',
              height: '100%',
              display: 'flex',
            }}
          >
            <Channel {...props} />
          </div>
          <div
            style={{
              width: '80.2%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                height: '11.1%',
                width: '100%',
                display: 'flex',
              }}
            >
              <Header {...props} />
            </div>
            <div
              style={{
                height: '88.9%',
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <div
                style={{
                  width: '75%',
                  height: '100%',
                  display: 'flex',
                }}
              >
                <Main {...props} />
              </div>
              <div
                style={{
                  height: '100%',
                  width: '25%',
                  display: 'flex',
                }}
              >
                <Sidebar {...props} />
              </div>
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: '0',
              left: '2.5%',
              width: '20%',
              height: '100%',
              display: 'flex',
            }}
          >
            <NotificationWrap {...props} />
          </div>
        </FixRatioBox>
      </div>
    </div>
  )
}

type Ratio = '1:1' | '16:9' | '40:21'
const ratioMap: Record<Ratio, `${number}%`> = {
  '1:1': '100%',
  '16:9': '56.25%',
  /// 1200 : 630 (OGP size)
  '40:21': '52.5%',
}
type FixRatioBoxProps = {
  ratio: Ratio
} & React.HTMLAttributes<HTMLDivElement>
const FixRatioBox: React.FC<FixRatioBoxProps> = ({
  ratio,
  children,
  style,
  ...props
}) => {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        ...style,
        position: 'relative',
      }}
      {...props}
    >
      <div
        style={{
          width: '100%',
          paddingTop: ratioMap[ratio],
        }}
      />
      {children != null && (
        <div
          style={{
            display: 'flex',
            // flexDirection: 'column',
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}

const Center: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  style,
  ...props
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}

const HGaper: React.FC<{ width: `${number}%` }> = ({ width }) => (
  <div
    style={{
      width,
      height: '100%',
    }}
  />
)
const VGaper: React.FC<{ height: `${number}%` }> = ({ height }) => (
  <div
    style={{
      width: '100%',
      height,
    }}
  />
)
const Nav: React.FC<Props> = ({ theme }) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: theme.basic.background.primary.default,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '50% 10%',
      }}
    >
      <FixRatioBox
        ratio='1:1'
        style={{
          backgroundColor: theme.basic.accent.primary.default,
          width: '80%',
          borderRadius: '9999px',
        }}
      />
      <VGaper height='2.5%' />
      <FixRatioBox
        ratio='1:1'
        style={{
          width: '90%',
          // aspectRatio: '1 / 1',
          position: 'relative',
        }}
      >
        <Center>
          <FixRatioBox
            ratio='1:1'
            style={{
              backgroundColor: theme.basic.accent.primary.default,
              width: '60%',
              // aspectRatio: '1 / 1',
              borderRadius: '9999px',
            }}
          />
        </Center>
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            bottom: '0',
            right: '0',
            display: 'flex',
          }}
        >
          <FixRatioBox
            ratio='1:1'
            style={{
              backgroundColor: theme.basic.accent.primary.default,
              // aspectRatio: '1 / 1',
              // position: 'absolute',
              borderRadius: '9999px',
              // top: '0',
              // left: '0',
              width: '100%',
              height: '100%',
              opacity: '0.1',
            }}
          />
        </div>
      </FixRatioBox>
      {Array.from({ length: 4 }).map((_, i) => (
        <React.Fragment key={i}>
          <FixRatioBox
            ratio='1:1'
            style={{
              width: '90%',
              marginTop: '30%',
            }}
          >
            <Center>
              <FixRatioBox
                ratio='1:1'
                style={{
                  backgroundColor: theme.basic.accent.primary.default,
                  width: '60%',
                  borderRadius: '9999px',
                  opacity: '0.3',
                }}
              />
            </Center>
          </FixRatioBox>
        </React.Fragment>
      ))}
    </div>
  )
}

const Channel: React.FC<Props> = ({ theme }) => {
  return (
    <div
      style={{
        width: '100%',
        backgroundColor: theme.basic.background.secondary.default,
        height: '100%',
      }}
    />
  )
}

const Header: React.FC<Props> = ({ theme }) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: theme.basic.background.primary.default,
        borderBottom: `1px solid ${theme.basic.ui.secondary.default}`,
        display: 'flex',
        paddingLeft: '2.5%',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: theme.basic.ui.secondary.inactive,
          borderRadius: '9999px',
          height: '50%',
          width: '20%',
        }}
      />
      <HGaper width='1%' />
      <div
        style={{
          backgroundColor: theme.basic.ui.secondary.default,
          borderRadius: '9999px',
          height: '50%',
          width: '20%',
        }}
      />
    </div>
  )
}

const Sidebar: React.FC<Props> = ({ theme }) => {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        backgroundColor: theme.basic.background.secondary.default,
        display: 'flex',
        flexDirection: 'column',
        padding: '5%',
      }}
    >
      <div
        style={{
          height: '5%',
          width: '60%',
          borderRadius: '9999px',
          backgroundColor: theme.basic.ui.primary.default,
        }}
      />
      <VGaper height='2.5%' />
      <div
        style={{
          height: '10%',
          width: '100%',
          backgroundColor: theme.basic.background.primary.default,
        }}
      />
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          style={{
            height: '8%',
            marginTop: '7.5%',
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
          />
          <FixRatioBox
            ratio='1:1'
            style={{
              width: '10%',
              backgroundColor: theme.basic.ui.secondary.default,
              borderRadius: '9999px',
            }}
          />
        </div>
      ))}
      <VGaper height='2.5%' />
      <div
        style={{
          height: '20%',
          width: '100%',
          backgroundColor: theme.basic.background.primary.default,
        }}
      />
    </div>
  )
}

const Main: React.FC<Props> = props => {
  const { author, theme } = props
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: theme.basic.background.primary.default,
        overflow: 'hidden',
        padding: '1% 0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Separator type='notification' {...props} />
        <VGaper height='10%' />
        <Separator type='date' {...props} />
        <VGaper height='10%' />
        <div
          style={{
            height: '30%',
            width: '100%',
            display: 'flex',
            padding: '0 5%',
          }}
        >
          <FixRatioBox
            ratio='1:1'
            style={{
              width: '17.5%',
              height: '65%',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={userIconUrl(author)}
              style={{
                borderRadius: '9999px',
                width: '100%',
              }}
              alt=''
            />
          </FixRatioBox>
          <HGaper width='2.5%' />
          <div
            style={{
              fontSize: '0.5rem',
              flexGrow: '1',
              height: '100%',
              width: '80%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                height: '20%',
                display: 'flex',
              }}
            >
              <span
                style={{
                  background: theme.basic.ui.primary.default,
                  borderRadius: '9999px',
                  width: '40%',
                  height: '100%',
                }}
              />
              <HGaper width='2.5%' />
              <span
                style={{
                  background: theme.basic.background.secondary.default,
                  borderRadius: '4px',
                  padding: '1% 4%',
                  width: '20%',
                  height: '100%',
                }}
              >
                <div
                  style={{
                    background: theme.basic.ui.secondary.default,
                    borderRadius: '9999px',
                    height: '100%',
                    width: '100%',
                  }}
                />
              </span>
              <HGaper width='2.5%' />
              <span
                style={{
                  background: theme.basic.ui.secondary.default,
                  borderRadius: '9999px',
                  height: '80%',
                  width: '30%',
                }}
              />
            </div>
            <div
              style={{
                width: '100%',
                height: '80%',
                display: 'flex',
                flexDirection: 'column',
                padding: '5% 0',
              }}
            >
              <div
                style={{
                  background: theme.basic.ui.primary.default,
                  height: '20%',
                  width: '100%',
                  borderRadius: '9999px',
                }}
              />
              <VGaper height='7.5%' />
              <div
                style={{
                  background: theme.basic.ui.primary.default,
                  height: '20%',
                  width: '100%',
                  borderRadius: '9999px',
                }}
              />
              <VGaper height='7.5%' />
              <div
                style={{
                  background: theme.basic.ui.primary.default,
                  height: '20%',
                  width: '30%',
                  borderRadius: '9999px',
                }}
              />
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
            justifyContent: 'flex-end',
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
          />
        </div>
      </div>
    </div>
  )
}

const Separator: React.FC<
  Props & {
    type: 'date' | 'notification'
  }
> = ({ theme, type }) => {
  const color =
    type === 'date'
      ? theme.basic.ui.secondary.default
      : theme.basic.accent.notification.default

  return (
    <div
      style={{
        height: '5%',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          height: '1px',
          backgroundColor: color,
          width: '35%',
          flexGrow: '1',
          flexShrink: '1',
        }}
      />
      <HGaper width='5%' />
      <div
        style={{
          height: '100%',
          width: '20%',
          borderRadius: '9999px',
          backgroundColor: color,
          flexGrow: '0',
          flexShrink: '0',
        }}
      />
      <HGaper width='5%' />
      <div
        style={{
          height: '1px',
          backgroundColor: color,
          width: '35%',
          flexGrow: '1',
          flexShrink: '100',
        }}
      />
    </div>
  )
}

const NotificationWrap: React.FC<Props> = props => {
  const { theme } = props

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column-reverse',
        paddingBottom: '2.5%',
      }}
    >
      <Notification color={theme.basic.accent.primary.default} {...props} />
      <VGaper height='2.5%' />
      <Notification color={theme.basic.ui.primary.default} {...props} />
      <VGaper height='2.5%' />
      <Notification color={theme.basic.accent.error.default} {...props} />
    </div>
  )
}

const Notification: React.FC<
  Props & {
    color: string
  }
> = ({ color }) => {
  return (
    <div
      style={{
        width: '100%',
        height: '10%',
        backgroundColor: color,
        borderRadius: '2px',
        overflow: 'hidden',
      }}
    />
  )
}
