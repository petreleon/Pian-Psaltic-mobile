import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

interface TermsAndConditionsModalProps {
    visible: boolean;
    onAccept: () => void;
    onClose?: () => void;
    isViewOnly?: boolean;
}

const TermsAndConditionsModal: React.FC<TermsAndConditionsModalProps> = ({
    visible,
    onAccept,
    onClose,
    isViewOnly = false
}) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
                if (isViewOnly && onClose) onClose();
            }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Termeni și Condiții</Text>
                    
                    <ScrollView style={styles.scrollView}>
                        <Text style={styles.modalText}>
                            Această aplicație este dublă licențiată: AGPL - Privat.
                        </Text>
                        <Text style={styles.modalText}>
                            Prin utilizarea acestei aplicații, sunteți de acord cu acești termeni.
                        </Text>
                    </ScrollView>


                    <TouchableOpacity
                        style={[styles.button, styles.buttonClose]}
                        onPress={isViewOnly && onClose ? onClose : onAccept}
                    >
                        <Text style={styles.textStyle}>
                            {isViewOnly ? "Închide" : "De acord"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: '#292524', // stone-800
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '85%',
        maxHeight: '70%',
    },
    modalTitle: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fbbf24', // amber-400
    },
    scrollView: {
        width: '100%',
        marginBottom: 20,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        color: '#e7e5e4', // stone-200
        fontSize: 16,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        minWidth: 120,
    },
    buttonClose: {
        backgroundColor: '#b45309', // amber-600
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
    },
});

export default TermsAndConditionsModal;
