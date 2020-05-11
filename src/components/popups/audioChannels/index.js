import "./styles.scss";
import React, { useState, useEffect, useContext } from "react";
import { connect } from "react-redux";

import { Droppable, DragDropContext } from "react-beautiful-dnd";

import { RoomContext } from "../../../providers/Room";
import { FloorContext } from "../../../providers/Floor";

import { saveArrayOrder, saveFloorRoomArrayOrder } from "../../../actions";

import InnerList from "./innerList";

const AudioChannels = ({ audioChannels, saveArrayOrder, saveFloorRoomArrayOrder }) => {
  const { globalRoom } = useContext(RoomContext);

  const { globalFloor, globalFloorRoom, globalFloorRoomIndex } = useContext(
    FloorContext
  );

  // These are the group products. They are created after all the products are filtered with the IDs of the group products
  const [orderedChannels, setOrderedChannels] = useState(null);

  // This state holds the array of groups as they were last saved. We keep this to pompare it to the localGroupIds after drag and to figure out if the current order is different from the one that was last saved to the DB.
  const [lastSavedChannelIds, setLastSavedChannelIds] = useState(null);

  // This state holds the array of groups in our account in their correct order. To prevent re-render and writing to the server every time the order of groups is changed, we just keep it here and when the user clicks save we deploy the changes both to the store and the server
  const [localChannelIds, setLocalChannelIds] = useState(null);

  // This state is an indication to chaeck if the current order of groups is differnt from the original. We use it to determine if the save button to save should show or not.
  const [isOrderDifferent, setIsOrderDifferent] = useState(false);

  useEffect(() => {
    // If we have channels set in the reducer then we're in the main page and we use those channels
    if (audioChannels.length) {
      setLocalChannelIds(audioChannels.map((ch) => ch.id));
      setLastSavedChannelIds(audioChannels.map((ch) => ch.id));
    }

    // If we have a floor room set, meaning we're currently in a festival room, we use that as our channels
    if (
      globalFloorRoom &&
      globalFloorRoom.audio_channels &&
      globalFloorRoom.audio_channels.length
    ) {
      setLocalChannelIds(globalFloorRoom.audio_channels.map((ch) => ch.id));
      setLastSavedChannelIds(globalFloorRoom.audio_channels.map((ch) => ch.id));
    }
  }, [audioChannels, globalFloorRoom]);

  /* When the order of our products changes (indicated by 'localProductIds'), or the products in the store change, we:
  1. If there are no products at all, we just return.
  2. Otherwise, we reset he group products state back to empty - is this even needed anymore?
  3. We iterate through the list of products.
  4. Grab the objects from the store products array.
  5. Create an array of the products that belong to this group.
  6. Set the state of "group products" to this new array. 
  */
  useEffect(() => {
    if (!localChannelIds) return;
    // if (
    //   (audio_channels && audioChannels.length) ||
    //   (globalFloorRoom &&
    //     globalFloorRoom.audio_channels &&
    //     globalFloorRoom.audio_channels.length)
    // )
    const newOrderedChannels =
      globalFloorRoom && globalFloorRoom.audio_channels
        ? localChannelIds
            .map(
              (groupId) =>
                globalFloorRoom.audio_channels.filter(
                  (el) => el.id === groupId
                )[0]
            )
            .filter((el) => el)
        : localChannelIds
            .map(
              (groupId) => audioChannels.filter((el) => el.id === groupId)[0]
            )
            .filter((el) => el);

    setOrderedChannels(newOrderedChannels);
  }, [localChannelIds, audioChannels, globalFloorRoom]);

  const onDragEnd = (
    result,
    localItemIds,
    lastSavedItemIds,
    setIsOrderDifferent,
    setLocalItemIds
  ) => {
    const { destination, source, draggableId, type } = result;

    // If there was no final desination nothing happened - return
    if (!destination) {
      return;
    }

    // if the product started and finished in the same column and same index nothing happened - return
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const newItemIds = [...localItemIds];

    // Remove the product (just an ID string) from the array
    newItemIds.splice(source.index, 1);

    // Re-insert the product (just an ID string) back to the array to its new position
    newItemIds.splice(destination.index, 0, draggableId);

    // We're setting the state of 'is order different' to a boolean based on whether the current order of products is identical to the initial order.
    const isSameArray =
      newItemIds.length === lastSavedItemIds.length &&
      newItemIds.every((value, index) => value === lastSavedItemIds[index]);

    setIsOrderDifferent(!isSameArray);
    setLocalItemIds([...newItemIds]);
  };

  return (
    <div className="popup" id="audio-channels">
      <div className="popup__close">
        <div />
        <div
          className="popup__close-text"
          onClick={() => {
            window.location.hash = "";
          }}
        >
          Close
        </div>
      </div>
      <DragDropContext
        onDragEnd={(result) =>
          onDragEnd(
            result,
            localChannelIds,
            lastSavedChannelIds,
            setIsOrderDifferent,
            setLocalChannelIds
          )
        }
      >
        <Droppable droppableId={"all-channels"} type={"all-channels"}>
          {(provided) => (
            <div
              className="groups"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {isOrderDifferent ? (
                <div
                  className="audio-channels__save-order small-margin-top"
                  onClick={() => {
                    globalFloorRoom
                      ? saveFloorRoomArrayOrder(
                          globalFloor,
                          globalFloorRoom,
                          globalFloorRoomIndex,
                          orderedChannels,
                          () => {
                            setIsOrderDifferent(false);
                            setLastSavedChannelIds(localChannelIds);
                          }
                        )
                      : saveArrayOrder(
                          "rooms",
                          "audio_channels",
                          orderedChannels,
                          globalRoom,
                          () => {
                            setIsOrderDifferent(false);
                            setLastSavedChannelIds(localChannelIds);
                          }
                        );
                  }}
                />
              ) : null}
              <div className="audio-channels__channels small-margin-top">
                {orderedChannels ? (
                  <InnerList
                    channels={orderedChannels}
                    room={globalRoom}
                    roomIndex={globalFloorRoomIndex}
                    floor={globalFloor}
                  />
                ) : null}
              </div>

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    audioChannels: state.audioChannels,
  };
};

export default connect(mapStateToProps, { saveArrayOrder, saveFloorRoomArrayOrder })(AudioChannels);
