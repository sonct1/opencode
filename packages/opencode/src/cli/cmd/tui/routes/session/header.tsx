import { type Accessor, createMemo, Match, Show, Switch, createSignal } from "solid-js"
import { useRouteData, useRoute } from "@tui/context/route"
import { useSync } from "@tui/context/sync"
import { pipe, sumBy } from "remeda"
import { useTheme } from "@tui/context/theme"
import { SplitBorder } from "@tui/component/border"
import type { AssistantMessage, Session } from "@opencode-ai/sdk/v2"
import { useKeybind } from "../../context/keybind"

const Title = (props: { session: Accessor<Session> }) => {
  const { theme } = useTheme()
  return (
    <text fg={theme.text}>
      <span style={{ bold: true }}>#</span> <span style={{ bold: true }}>{props.session().title}</span>
    </text>
  )
}

const ContextInfo = (props: { context: Accessor<string | undefined>; cost: Accessor<string> }) => {
  const { theme } = useTheme()
  return (
    <Show when={props.context()}>
      <text fg={theme.textMuted} wrapMode="none" flexShrink={0}>
        {props.context()} ({props.cost()})
      </text>
    </Show>
  )
}

export function Header() {
  const route = useRouteData("session")
  const sync = useSync()
  const { navigate } = useRoute()
  const session = createMemo(() => sync.session.get(route.sessionID)!)
  const messages = createMemo(() => sync.data.message[route.sessionID] ?? [])
  const shareEnabled = createMemo(() => sync.data.config.share !== "disabled")

  const cost = createMemo(() => {
    const total = pipe(
      messages(),
      sumBy((x) => (x.role === "assistant" ? x.cost : 0)),
    )
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(total)
  })

  const context = createMemo(() => {
    const last = messages().findLast((x) => x.role === "assistant" && x.tokens.output > 0) as AssistantMessage
    if (!last) return
    const total =
      last.tokens.input + last.tokens.output + last.tokens.reasoning + last.tokens.cache.read + last.tokens.cache.write
    const model = sync.data.provider.find((x) => x.id === last.providerID)?.models[last.modelID]
    let result = total.toLocaleString()
    if (model?.limit.context) {
      result += "  " + Math.round((total / model.limit.context) * 100) + "%"
    }
    return result
  })

  const { theme } = useTheme()
  const keybind = useKeybind()
  const [hoveredButton, setHoveredButton] = createSignal<string | null>(null)

  const handleBack = () => {
    const parentSession = sync.data.session.find((x) => x.id === session()?.parentID)
    if (parentSession) {
      navigate({ type: "session", sessionID: parentSession.id })
    }
  }

  const handlePrev = () => {
    const parentID = session()?.parentID ?? session()?.id
    let children = sync.data.session
      .filter((x) => x.parentID === parentID || x.id === parentID)
      .toSorted((b, a) => a.id.localeCompare(b.id))
    if (children.length <= 1) return
    let prev = children.findIndex((x) => x.id === session()?.id) - 1
    if (prev < 0) prev = children.length - 1
    if (children[prev]) {
      navigate({ type: "session", sessionID: children[prev].id })
    }
  }

  const handleNext = () => {
    const parentID = session()?.parentID ?? session()?.id
    let children = sync.data.session
      .filter((x) => x.parentID === parentID || x.id === parentID)
      .toSorted((b, a) => a.id.localeCompare(b.id))
    if (children.length <= 1) return
    let next = children.findIndex((x) => x.id === session()?.id) + 1
    if (next >= children.length) next = 0
    if (children[next]) {
      navigate({ type: "session", sessionID: children[next].id })
    }
  }

  return (
    <box flexShrink={0}>
      <box
        paddingTop={1}
        paddingBottom={1}
        paddingLeft={2}
        paddingRight={1}
        {...SplitBorder}
        border={["left"]}
        borderColor={theme.border}
        flexShrink={0}
        backgroundColor={theme.backgroundPanel}
      >
        <Switch>
          <Match when={session()?.parentID}>
            <box flexDirection="row" gap={2}>
              <text fg={theme.text}>
                <b>Subagent session</b>
              </text>
              <box
                onMouseUp={handleBack}
                onMouseOver={() => setHoveredButton("back")}
                onMouseOut={() => setHoveredButton(null)}
              >
                <text fg={hoveredButton() === "back" ? theme.accent : theme.text}>
                  Back <span style={{ fg: theme.textMuted }}>{keybind.print("session_parent")}</span>
                </text>
              </box>
              <box
                onMouseUp={handlePrev}
                onMouseOver={() => setHoveredButton("prev")}
                onMouseOut={() => setHoveredButton(null)}
              >
                <text fg={hoveredButton() === "prev" ? theme.accent : theme.text}>
                  Prev <span style={{ fg: theme.textMuted }}>{keybind.print("session_child_cycle_reverse")}</span>
                </text>
              </box>
              <box
                onMouseUp={handleNext}
                onMouseOver={() => setHoveredButton("next")}
                onMouseOut={() => setHoveredButton(null)}
              >
                <text fg={hoveredButton() === "next" ? theme.accent : theme.text}>
                  Next <span style={{ fg: theme.textMuted }}>{keybind.print("session_child_cycle")}</span>
                </text>
              </box>
              <box flexGrow={1} flexShrink={1} />
              <ContextInfo context={context} cost={cost} />
            </box>
          </Match>
          <Match when={true}>
            <box flexDirection="row" justifyContent="space-between" gap={1}>
              <Title session={session} />
              <ContextInfo context={context} cost={cost} />
            </box>
            <Show when={shareEnabled()}>
              <box flexDirection="row" justifyContent="space-between" gap={1}>
                <box flexGrow={1} flexShrink={1}>
                  <Switch>
                    <Match when={session().share?.url}>
                      <text fg={theme.textMuted} wrapMode="word">
                        {session().share!.url}
                      </text>
                    </Match>
                    <Match when={true}>
                      <text fg={theme.text} wrapMode="word">
                        /share <span style={{ fg: theme.textMuted }}>copy link</span>
                      </text>
                    </Match>
                  </Switch>
                </box>
              </box>
            </Show>
          </Match>
        </Switch>
      </box>
    </box>
  )
}
