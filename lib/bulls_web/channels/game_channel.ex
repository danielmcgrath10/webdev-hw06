defmodule BullsWeb.GameChannel do
  use BullsWeb, :channel

  @impl true
  def join("game:" <> name, payload, socket) do
    if authorized?(payload) do
      Bulls.GameServer.start(name)
      view = Bulls.GameServer.peek(name)
      |> Bulls.Game.view("")
      socket = assign(socket, :name, name)
      {:ok, view, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  @impl true
  def handle_in("login", %{"name" => user}, socket) do 
      socket = assign(socket, :user, user)
      name = socket.assigns[:name]
      view = Bulls.GameServer.peek(name)
      |> Bulls.Game.view(user)
      {:reply, {:ok, view}, socket}
    end

  @impl true
  def handle_in("guess", %{"guess" => ll}, socket) do
    user = socket.assigns[:user]
    name = socket.assigns[:name]
    view = Bulls.GameServer.guess(name, ll)
    |> Bulls.Game.view(user)
    broadcast(socket, "view", view)
    {:reply, {:ok, view}, socket}
  end


  @impl true
  def handle_in("reset", _, socket) do
    user = socket.assigns[:user]
    name = socket.assigns[:name]
    view = Bulls.GameServer.reset(name)
    |> Bulls.Game.view(user)
    broadcast(socket, "view", view)
    {:reply, {:ok, view}, socket}
  end
  
  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
