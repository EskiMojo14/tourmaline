class ThreadsChannel < ApplicationCable::Channel
  def subscribed
    stream_from "threads"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
